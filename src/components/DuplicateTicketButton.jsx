import { Copy } from 'lucide-react';
import { useContext } from 'react';
import toast from 'react-hot-toast';
import TicketContext from '../context/TicketContext';

function DuplicateTicketButton({ ticket, onSuccess }) {
  const { createTicket } = useContext(TicketContext);

  const handleDuplicate = async () => {
    if (!window.confirm(`Duplicate ticket ${ticket.ticketKey}?`)) return;

    const duplicateData = {
      title: `[COPY] ${ticket.title}`,
      description: ticket.description,
      type: ticket.type,
      priority: ticket.priority,
      tags: ticket.tags,
    };

    const result = await createTicket(ticket.project._id || ticket.project, duplicateData);

    if (result.success) {
      toast.success('Ticket duplicated successfully!');
      if (onSuccess) onSuccess();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <button
      onClick={handleDuplicate}
      className="p-2.5 hover:bg-purple-50 text-purple-600 rounded-xl transition-colors"
      title="Duplicate Ticket"
    >
      <Copy className="w-5 h-5" />
    </button>
  );
}

export default DuplicateTicketButton;