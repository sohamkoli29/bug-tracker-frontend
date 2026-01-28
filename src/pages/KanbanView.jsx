import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import KanbanBoard from '../components/KanbanBoard';
import CreateTicketModal from '../components/CreateTicketModal';
import TicketDetailModal from '../components/TicketDetailModal';
import TicketContext from '../context/TicketContext';
import ProjectContext from '../context/ProjectContext';

function KanbanView() {
  const { id } = useParams();
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [projectTickets, setProjectTickets] = useState([]);

  const { tickets, getTickets, loading } = useContext(TicketContext);
  const { getProject } = useContext(ProjectContext);

  useEffect(() => {
    if (id) {
      getProject(id);
      loadTickets();
    }
  }, [id]);

  const loadTickets = async () => {
    await getTickets(id);
  };

  useEffect(() => {
    setProjectTickets(tickets);
  }, [tickets]);

  return (
    <DashboardLayout showProjectSelector currentProjectId={id}>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading Kanban board...</p>
          </div>
        </div>
      ) : (
        <KanbanBoard
          projectId={id}
          tickets={projectTickets}
          onTicketClick={(ticket) => setSelectedTicket(ticket)}
          onCreateTicket={() => setShowCreateTicketModal(true)}
        />
      )}

      {/* Create Ticket Modal */}
      {showCreateTicketModal && (
        <CreateTicketModal
          projectId={id}
          onClose={() => setShowCreateTicketModal(false)}
          onSuccess={() => {
            loadTickets();
          }}
        />
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={(updatedTicket) => {
            if (updatedTicket) {
              setProjectTickets(
                projectTickets.map((t) =>
                  t._id === updatedTicket._id ? updatedTicket : t
                )
              );
              setSelectedTicket(updatedTicket);
            } else {
              loadTickets();
              setSelectedTicket(null);
            }
          }}
        />
      )}
    </DashboardLayout>
  );
}

export default KanbanView;