import { useState, useEffect } from 'react';
import { Link2, Search, Plus } from 'lucide-react'; // v2

import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import EventTypeCard from '../../components/event-types/EventTypeCard';
import EventTypeForm from '../../components/event-types/EventTypeForm';
import { useEventTypes } from '../../hooks/useEventTypes';
import { useNavigate } from 'react-router-dom';

function SkeletonRow() {
  return (
    <div className="h-[88px] animate-pulse border-b border-zinc-800/50 bg-[#0A0A0A]" />
  );
}

function EventTypesPage() {
  const { eventTypes, isLoading, createEventType, updateEventType, deleteEventType } = useEventTypes();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderedEventTypes, setOrderedEventTypes] = useState([]);

  useEffect(() => {
    if (eventTypes && eventTypes.length > 0) {
      setOrderedEventTypes((prev) => {
        if (prev.length !== eventTypes.length) {
          return [...eventTypes];
        }
        return prev.map(ordered => {
          const fresh = eventTypes.find(e => e.id === ordered.id);
          return fresh || ordered;
        });
      });
    } else {
      setOrderedEventTypes([]);
    }
  }, [eventTypes]);

  const openCreate = () => setModalOpen(true);

  const openEdit = (eventType) => {
    navigate(`/admin/event-types/${eventType.id}`);
  };

  const handleToggle = async (eventType) => {
    try {
      await updateEventType(eventType.id, { ...eventType, is_active: !eventType.is_active });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const result = await createEventType(values);
      setModalOpen(false);
      if (result && (result.id || (result.data && result.data.id))) {
        const newId = result.id || result.data.id;
        navigate(`/admin/event-types/${newId}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (eventType) => {
    await deleteEventType(eventType.id);
  };

  const handleMoveUp = (eventType) => {
    const filteredIndex = filteredEventTypes.findIndex((e) => e.id === eventType.id);
    if (filteredIndex > 0) {
      const neighbor = filteredEventTypes[filteredIndex - 1];
      const globalIndex = orderedEventTypes.findIndex((e) => e.id === eventType.id);
      const globalNeighborIndex = orderedEventTypes.findIndex((e) => e.id === neighbor.id);
      const newOrder = [...orderedEventTypes];
      [newOrder[globalIndex], newOrder[globalNeighborIndex]] = [newOrder[globalNeighborIndex], newOrder[globalIndex]];
      setOrderedEventTypes(newOrder);
    }
  };

  const handleMoveDown = (eventType) => {
    const filteredIndex = filteredEventTypes.findIndex((e) => e.id === eventType.id);
    if (filteredIndex < filteredEventTypes.length - 1) {
      const neighbor = filteredEventTypes[filteredIndex + 1];
      const globalIndex = orderedEventTypes.findIndex((e) => e.id === eventType.id);
      const globalNeighborIndex = orderedEventTypes.findIndex((e) => e.id === neighbor.id);
      const newOrder = [...orderedEventTypes];
      [newOrder[globalIndex], newOrder[globalNeighborIndex]] = [newOrder[globalNeighborIndex], newOrder[globalIndex]];
      setOrderedEventTypes(newOrder);
    }
  };

  const filteredEventTypes = orderedEventTypes.filter((event) =>
    event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-white tracking-tight">Event types</h1>
          <p className="mt-1.5 text-[14px] font-medium text-zinc-400">
            Create events to share for people to book on your calendar.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-[200px] bg-transparent border border-zinc-700/80 rounded-[8px] py-1.5 pl-9 pr-4 text-[14px] text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 font-medium transition-all"
            />
          </div>
          <button
            onClick={openCreate}
            className="bg-zinc-100 text-black px-4 py-1.5 rounded-[8px] text-[14px] font-bold hover:bg-white transition-all flex items-center shadow-sm"
          >
            <Plus size={16} className="mr-1.5" strokeWidth={3} /> New
          </button>
        </div>
      </div>

      {/* Event Types List */}
      <div className="rounded-[12px] border border-zinc-800 bg-[#0A0A0A] shadow-sm">
        {isLoading ? (
          <div className="divide-y divide-zinc-800">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : filteredEventTypes.length === 0 ? (
          <div className="py-16">
            <EmptyState
              icon={Link2}
              title={searchQuery ? 'No matching event types' : 'No event types yet'}
              subtitle={
                searchQuery
                  ? 'Try adjusting your search terms.'
                  : 'Create your first event type to start accepting bookings.'
              }
              ctaLabel="Create event type"
              onCtaClick={openCreate}
            />
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/80">
            {filteredEventTypes.map((event, index) => (
              <EventTypeCard
                key={event.id}
                eventType={event}
                onEdit={openEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                isFirst={index === 0}
                isLast={index === filteredEventTypes.length - 1}
                className={`
                  ${index === 0 ? 'rounded-t-[12px]' : ''}
                  ${index === filteredEventTypes.length - 1 ? 'rounded-b-[12px]' : ''}
                `}
              />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <EventTypeForm
          defaultValues={null}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default EventTypesPage;
