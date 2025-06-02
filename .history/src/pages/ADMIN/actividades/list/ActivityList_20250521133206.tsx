import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllActivities,
  deleteActivity,
  fetchDifficulties,
  fetchActivityTypes,
} from '../../../../services/ApiService';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Toast from '../../../../components/toast/Toast';

interface Activity {
  id: number;
  title: string;
  description: string;
  resourceUrl: string;
  type: { id: number; name: string };
  difficulty: { id: number; name: string };
}

interface Difficulty {
  id: number;
  name: string;
}

interface ActivityType {
  id: number;
  name: string;
}

const ActivityList = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [types, setTypes] = useState<ActivityType[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<number | 'all'>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { applyFilters(); }, [activities, selectedDifficulty, selectedType]);

  const fetchData = async () => {
    try {
      const [acts, diffs, tps] = await Promise.all([
        fetchAllActivities(),
        fetchDifficulties(),
        fetchActivityTypes()
      ]);
      setActivities(acts.data);
      setDifficulties(diffs.data);
      setTypes(tps.data);
    } catch {
      setToast({ message: 'Error cargando datos', type: 'error' });
    }
  };

  const applyFilters = () => {
    let filtered = [...activities];
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(act => act.difficulty.id === selectedDifficulty);
    }
    if (selectedType !== 'all') {
      filtered = filtered.filter(act => act.type.id === selectedType);
    }
    setFilteredActivities(filtered);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteActivity(deleteId);
      setToast({ message: 'Actividad eliminada correctamente', type: 'success' });
      setDeleteId(null);
      fetchData();
    } catch {
      setToast({ message: 'No se pudo eliminar la actividad.', type: 'error' });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-xl">Lista de Actividades</CardTitle>
          <Button onClick={() => navigate('/app/crear-actividad')}>Crear Nueva Actividad</Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <Select onValueChange={(value) => setSelectedDifficulty(value === 'all' ? 'all' : Number(value))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por dificultad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {difficulties.map(d => (
                  <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setSelectedType(value === 'all' ? 'all' : Number(value))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {types.map(t => (
                  <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Dificultad</TableHead>
                <TableHead>Recurso</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map(activity => (
                <TableRow key={activity.id}>
                  <TableCell>{activity.id}</TableCell>
                  <TableCell>{activity.title}</TableCell>
                  <TableCell>{activity.description}</TableCell>
                  <TableCell>{activity.type.name}</TableCell>
                  <TableCell>{activity.difficulty.name}</TableCell>
                  <TableCell>
                    <a
                      href={activity.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Ver recurso
                    </a>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/app/editar-actividad/${activity.id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setDeleteId(activity.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredActivities.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No hay actividades para mostrar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar actividad?</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro de que deseas eliminar esta actividad?</p>
          <DialogFooter className="mt-4">
            <Button variant="destructive" onClick={confirmDelete}>Sí, eliminar</Button>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActivityList;
