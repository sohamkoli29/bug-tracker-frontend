import { useState, useContext, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MoreVertical, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import TicketContext from '../context/TicketContext';
import ProjectContext from '../context/ProjectContext';

const COLUMNS = [
  {
    id: 'todo',
    title: 'To Do',
    color: 'slate',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-700',
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
  },
  {
    id: 'done',
    title: 'Done',
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
  },
];

function KanbanBoard({ projectId, tickets, onTicketClick, onCreateTicket }) {
  const { updateTicket } = useContext(TicketContext);
  const { currentProject } = useContext(ProjectContext);
  const [columns, setColumns] = useState({
    todo: [],
    'in-progress': [],
    done: [],
  });

  // Organize tickets into columns
  useEffect(() => {
    const organized = {
      todo: tickets.filter((t) => t.status === 'todo'),
      'in-progress': tickets.filter((t) => t.status === 'in-progress'),
      done: tickets.filter((t) => t.status === 'done'),
    };
    setColumns(organized);
  }, [tickets]);

const onDragEnd = async (result) => {
  const { source, destination } = result;

  // Dropped outside the list
  if (!destination) {
    return;
  }

  // Dropped in the same position
  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  ) {
    return;
  }

  const sourceColumn = source.droppableId;
  const destColumn = destination.droppableId;

  // Get the ticket being moved using the index
  const sourceTickets = columns[sourceColumn];
  const ticket = sourceTickets[source.index];

  if (!ticket) return;

  // Optimistically update UI
  const newColumns = { ...columns };
  const sourceItems = Array.from(newColumns[sourceColumn]);
  const destItems =
    sourceColumn === destColumn
      ? sourceItems
      : Array.from(newColumns[destColumn]);

  // Remove from source
  const [removed] = sourceItems.splice(source.index, 1);

  // Add to destination
  destItems.splice(destination.index, 0, removed);

  // Update state
  newColumns[sourceColumn] = sourceItems;
  newColumns[destColumn] = destItems;
  setColumns(newColumns);

  // Update ticket status in backend
  const updateResult = await updateTicket(ticket._id, { status: destColumn });

  if (updateResult.success) {
    toast.success(`Ticket moved to ${COLUMNS.find((c) => c.id === destColumn).title}`);
  } else {
    toast.error('Failed to update ticket status');
    // Revert optimistic update
    setColumns(columns);
  }
};

  const getInitials = (name) => {
    return name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Kanban Board</h2>
        <button
          onClick={onCreateTicket}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          New Issue
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex flex-col">
              {/* Column Header */}
              <div
                className={`flex items-center justify-between p-4 ${column.bgColor} ${column.borderColor} border-2 rounded-t-xl`}
              >
                <div className="flex items-center gap-3">
                  <h3 className={`font-bold ${column.textColor}`}>
                    {column.title}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2 py-1 ${column.bgColor} ${column.textColor} rounded-full`}
                  >
                    {columns[column.id].length}
                  </span>
                </div>
                <button className="p-1 hover:bg-white/50 rounded transition-colors">
                  <MoreVertical className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              {/* Droppable Column */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-4 ${column.bgColor} ${column.borderColor} border-2 border-t-0 rounded-b-xl min-h-[500px] transition-colors ${
                      snapshot.isDraggingOver
                        ? 'bg-opacity-50 ring-2 ring-blue-400'
                        : ''
                    }`}
                  >
                    <div className="space-y-3">
                      {columns[column.id].map((ticket, index) => (
                        <Draggable
                          key={ticket._id}
                          draggableId={ticket._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => onTicketClick(ticket)}
                              className={`bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer ${
                                snapshot.isDragging
                                  ? 'ring-2 ring-blue-500 shadow-2xl rotate-2'
                                  : ''
                              }`}
                            >
                              {/* Ticket Header */}
                              <div className="flex items-start justify-between mb-2">
                                <span
                                  className="text-xs font-semibold px-2 py-1 rounded-md"
                                  style={{
                                    backgroundColor: `${currentProject?.color}20`,
                                    color: currentProject?.color,
                                  }}
                                >
                                  {ticket.ticketKey}
                                </span>
                                <div className="flex gap-1">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-md font-medium ${
                                      ticket.priority === 'critical'
                                        ? 'bg-red-100 text-red-700'
                                        : ticket.priority === 'high'
                                        ? 'bg-orange-100 text-orange-700'
                                        : ticket.priority === 'medium'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {ticket.priority}
                                  </span>
                                </div>
                              </div>

                              {/* Ticket Title */}
                              <h4 className="font-semibold text-slate-800 mb-2 line-clamp-2">
                                {ticket.title}
                              </h4>

                              {/* Ticket Description */}
                              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                {ticket.description}
                              </p>

                              {/* Ticket Footer */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-md font-medium ${
                                      ticket.type === 'bug'
                                        ? 'bg-red-50 text-red-600'
                                        : ticket.type === 'feature'
                                        ? 'bg-blue-50 text-blue-600'
                                        : ticket.type === 'improvement'
                                        ? 'bg-purple-50 text-purple-600'
                                        : 'bg-green-50 text-green-600'
                                    }`}
                                  >
                                    {ticket.type === 'bug'
                                      ? '🐛'
                                      : ticket.type === 'feature'
                                      ? '✨'
                                      : ticket.type === 'improvement'
                                      ? '🚀'
                                      : '📋'}
                                  </span>
                                  {ticket.tags && ticket.tags.length > 0 && (
                                    <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                                      +{ticket.tags.length}
                                    </span>
                                  )}
                                </div>

                                {/* Assignee */}
                                {ticket.assignee ? (
                                  <div
                                    className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold shadow-md"
                                    title={ticket.assignee.name}
                                  >
                                    {getInitials(ticket.assignee.name)}
                                  </div>
                                ) : (
                                  <div
                                    className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-xs font-semibold"
                                    title="Unassigned"
                                  >
                                    ?
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>

                    {/* Empty State */}
                    {columns[column.id].length === 0 && (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-slate-400 text-center">
                          Drop tickets here
                          <br />
                          or click + to create
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default KanbanBoard;