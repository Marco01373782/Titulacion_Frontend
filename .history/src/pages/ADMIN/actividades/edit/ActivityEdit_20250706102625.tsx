import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchActivityById,
    updateActivity,
    fetchActivityTypes,
    fetchDifficulties,
    getQuestionsByActivity,
    updateQuestion,
    createQuestion
} from '../../../../services/ApiService';
import LoadingOverlay from '../../../../components/modal/Loading/LoadingOverlay';
import Toast from '../../../../components/toast/Toast';
import {
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    FormControl,
    InputLabel
} from '@mui/material';

const ActivityEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [resourceUrl, setResourceUrl] = useState('');
    const [type, setType] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [types, setTypes] = useState<string[]>([]);
    const [difficulties, setDifficulties] = useState<string[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [activityRes, typesRes, diffsRes] = await Promise.all([
                    fetchActivityById(Number(id)),
                    fetchActivityTypes(),
                    fetchDifficulties()
                ]);
                const actData = activityRes.data;
                setActivity(actData);
                setTitle(actData.title);
                setDescription(actData.description);
                setResourceUrl(actData.resourceUrl);
                setType(actData.type);
                setDifficulty(actData.difficulty);
                setTypes(typesRes.data);
                setDifficulties(diffsRes.data);

                if (actData.type === 'ATENCION') {
                    const questionsRes = await getQuestionsByActivity(Number(id));
                    setQuestions(questionsRes.data);
                }
            } catch (error) {
                setToast({ message: 'No se pudieron cargar los datos.', type: 'error' });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleSave = async () => {
        if (!title || !description || !type || !difficulty) {
            setToast({ message: 'Completa todos los campos.', type: 'error' });
            return;
        }
        setSaving(true);
        try {
            await updateActivity(Number(id), { title, description, resourceUrl, type, difficulty });
            for (const question of questions) {
                await updateQuestion(question.id, {
                    questionText: question.questionText,
                    answers: question.answerOptions.map((a: any) => ({
                        answerText: a.answerText,
                        isCorrect: a.isCorrect
                    }))
                });
            }
            setToast({ message: 'Actividad y preguntas actualizadas correctamente', type: 'success' });
            setTimeout(() => navigate('/admin/gestionar-actividades'), 1500);
        } catch (error) {
            setToast({ message: 'Error al actualizar.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            id: Date.now(),
            questionText: '',
            answerOptions: [
                { answerText: '', isCorrect: true },
                { answerText: '', isCorrect: false }
            ]
        };
        setQuestions([...questions, newQuestion]);
    };

    const handleCancel = () => navigate('/admin/gestionar-actividades');

    return (
        <Box p={2} maxWidth={800} mx="auto">
            <Typography variant="h4" gutterBottom>Editar Actividad</Typography>
            <LoadingOverlay visible={loading || saving} message={saving ? 'Actualizando...' : 'Cargando...'} />
            {activity && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                >
                    <TextField
                        label="Título"
                        fullWidth
                        margin="normal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        label="Descripción"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField
                        label="URL del recurso"
                        fullWidth
                        margin="normal"
                        value={resourceUrl}
                        onChange={(e) => setResourceUrl(e.target.value)}
                    />
                    <FormControl fullWidth margin="normal" disabled>
                        <InputLabel>Tipo de actividad</InputLabel>
                        <Select value={type} label="Tipo de actividad">
                            {types.map((t) => (
                                <MenuItem key={t} value={t}>{t.replace(/_/g, ' ')}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal" disabled>
                        <InputLabel>Dificultad</InputLabel>
                        <Select value={difficulty} label="Dificultad">
                            {difficulties.map((d) => (
                                <MenuItem key={d} value={d}>{d}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {type === 'ATENCION' && questions.map((q, i) => (
                        <Box key={q.id} mt={3} p={2} border={1} borderRadius={2}>
                            <Typography variant="h6">Pregunta {i + 1}</Typography>
                            <TextField
                                label="Texto de la pregunta"
                                fullWidth
                                margin="normal"
                                value={q.questionText}
                                onChange={(e) => {
                                    const updated = [...questions];
                                    updated[i].questionText = e.target.value;
                                    setQuestions(updated);
                                }}
                            />
                            {q.answerOptions.map((a: any, j: number) => (
                                <TextField
                                    key={j}
                                    label={`Respuesta ${j + 1}${a.isCorrect ? ' (Correcta)' : ''}`}
                                    fullWidth
                                    margin="normal"
                                    value={a.answerText}
                                    onChange={(e) => {
                                        const updated = [...questions];
                                        updated[i].answerOptions[j].answerText = e.target.value;
                                        setQuestions(updated);
                                    }}
                                />
                            ))}
                        </Box>
                    ))}

                    {type === 'ATENCION' && (
                        <Box mt={2}>
                            <Button variant="outlined" color="primary" onClick={handleAddQuestion}>Añadir nueva pregunta</Button>
                        </Box>
                    )}

                    <Box display="flex" justifyContent="space-between" mt={3}>
                        <Button variant="contained" color="primary" type="submit" disabled={saving}>Guardar</Button>
                        <Button variant="outlined" color="secondary" onClick={handleCancel} disabled={saving}>Cancelar</Button>
                    </Box>
                </form>
            )}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </Box>
    );
};

export default ActivityEdit;
