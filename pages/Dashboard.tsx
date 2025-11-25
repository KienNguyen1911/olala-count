import React, { useState, useMemo } from 'react';
import { Plus, Settings, LogOut, CheckSquare, AlignLeft, Trash2, Bell, BellOff, Download, Pencil, Calendar, Save, ArrowLeft, X } from 'lucide-react';
import { Event, User, Note } from '../types';
import * as storage from '../services/storageService';
import CountdownCard from '../components/CountdownCard';
import Drawer from '../components/Drawer';
import NeoButton from '../components/ui/NeoButton';
import NeoInput from '../components/ui/NeoInput';
import WheelPicker from '../components/WheelPicker'; 
import { motion } from 'framer-motion';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}


const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [events, setEvents] = useState<Event[]>(storage.getEvents());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // View vs Edit Mode state
  const [isViewMode, setIsViewMode] = useState(false);

  // Settings/Profile Drawer state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(storage.getPushStatus());

  // PWA install prompt state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDate, setFormDate] = useState(new Date());
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<'personal' | 'work' | 'trip' | 'other'>('personal');
  const [formTheme, setFormTheme] = useState('#B8FF9F');

  // Note System (Hybrid UX)
  const [activeNoteMode, setActiveNoteMode] = useState<'A' | 'B'>('A');
  const [subNotes, setSubNotes] = useState<Note[]>([]);
  const [newSubNote, setNewSubNote] = useState('');

  // Listen for beforeinstallprompt event
  React.useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Detect if app is already installed
    const checkInstalled = () => {
      // For most browsers
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setCanInstall(false);
      }
      // For iOS Safari
      if ((window.navigator as any).standalone === true) {
        setCanInstall(false);
      }
    };
    checkInstalled();
    window.addEventListener('appinstalled', () => setCanInstall(false));

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    resetForm();
    
    // Set default date to Today at 8:00 AM
    const today = new Date();
    today.setHours(8, 0, 0, 0);
    setFormDate(today);

    setIsViewMode(false); // Direct to edit mode for new events
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (event: Event) => {
    setEditingEvent(event);
    
    // PRE-POPULATE Description and Notes immediately for View Mode editing
    setFormDesc(event.description || '');
    setSubNotes(event.notes || []);
    setActiveNoteMode((event.notes && event.notes.length > 0) ? 'B' : 'A');

    // Start in view mode
    setIsViewMode(true); 
    setIsDrawerOpen(true);
  };

  const switchToEditMode = () => {
    if (!editingEvent) return;
    setFormName(editingEvent.name);
    setFormDate(new Date(editingEvent.targetDate));
    setFormCategory(editingEvent.category);
    setFormTheme(editingEvent.themeColor);
    // Desc and Notes are already populated in handleOpenEdit
    setIsViewMode(false);
  };

  const resetForm = () => {
    setFormName('');
    setFormDate(new Date());
    setFormDesc('');
    setFormCategory('personal');
    setFormTheme('#B8FF9F');
    setSubNotes([]);
    setActiveNoteMode('A');
  };

  const handleSave = () => {
    // Handle View Mode Save (Only Desc/Notes)
    if (isViewMode && editingEvent) {
       const updatedEvent: Event = {
         ...editingEvent,
         description: formDesc,
         notes: subNotes,
         updatedAt: new Date().toISOString(),
       };
       const updatedEvents = storage.saveEvent(updatedEvent);
       setEvents(updatedEvents);
       setIsDrawerOpen(false);
       return;
    }

    // Handle Full Edit Mode Save
    if (!formName.trim()) {
        alert("Please enter an event name.");
        return;
    }

    // Validate that date is not in the past
    const now = new Date();
    if (formDate < now) {
        alert("Target date cannot be in the past.");
        return;
    }

    const newEvent: Event = {
      id: editingEvent ? editingEvent.id : Date.now().toString(),
      name: formName,
      targetDate: formDate.toISOString(),
      description: formDesc,
      category: formCategory,
      themeColor: formTheme,
      notes: subNotes,
      createdAt: editingEvent ? editingEvent.createdAt : new Date().toISOString(),
    };

    const updatedEvents = storage.saveEvent(newEvent);
    setEvents(updatedEvents);
    setIsDrawerOpen(false);
  };

  const handleDelete = () => {
    if (editingEvent) {
      if (window.confirm("Are you sure you want to delete this event?")) {
        const updated = storage.deleteEvent(editingEvent.id);
        setEvents(updated);
        setIsDrawerOpen(false);
      }
    }
  };

  const addSubNote = () => {
    if (!newSubNote.trim()) return;
    const note: Note = { id: Date.now().toString(), content: newSubNote, isCompleted: false };
    setSubNotes([...subNotes, note]);
    setNewSubNote('');
  };

  const toggleSubNote = (id: string) => {
    setSubNotes(subNotes.map(n => n.id === id ? { ...n, isCompleted: !n.isCompleted } : n));
  };

  const deleteSubNote = (id: string) => {
    setSubNotes(subNotes.filter(n => n.id !== id));
  };

  const togglePush = () => {
    const newState = storage.togglePushStatus();
    setPushEnabled(newState);
    if(newState) {
       // Mock browser permission request
       alert("Simulated Browser Permission Request: GRANTED. \n\n(In a real app, this prompts user permission).");
    }
  };

  const installPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          // User accepted
        }
        setDeferredPrompt(null);
        setCanInstall(false);
      });
    }
  };

  // --- Render Helper for the Note/Desc Section (Used in both modes) ---
  const renderNoteInputSection = () => (
    <div className="border-t-2 border-black pt-6">
      <label className="font-bold text-sm ml-1 uppercase block mb-2 text-black">
        Notes & Details
      </label>
      <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg border-2 border-black inline-flex">
          <button 
            onClick={() => setActiveNoteMode('A')}
            className={`px-4 py-2 rounded font-bold text-sm flex items-center gap-2 transition-all ${activeNoteMode === 'A' ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:text-black'}`}
          >
            <AlignLeft size={16} /> Overview
          </button>
          <button 
            onClick={() => setActiveNoteMode('B')}
            className={`px-4 py-2 rounded font-bold text-sm flex items-center gap-2 transition-all ${activeNoteMode === 'B' ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:text-black'}`}
          >
            <CheckSquare size={16} /> Planning
          </button>
      </div>

      {activeNoteMode === 'A' ? (
        <textarea 
            className="w-full h-32 bg-white text-black border-2 border-black shadow-neo-sm p-3 rounded-md font-medium focus:outline-none resize-none placeholder:text-gray-500"
            placeholder="Add details about this event..."
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
        />
      ) : (
        <div className="space-y-3">
            <div className="flex gap-2">
              <input 
                className="flex-1 border-2 border-black px-3 py-2 rounded font-medium bg-white text-black placeholder:text-gray-500"
                placeholder="Add a task..."
                value={newSubNote}
                onChange={(e) => setNewSubNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSubNote()}
              />
              <button onClick={addSubNote} className="bg-black text-white px-4 rounded border-2 border-black hover:bg-gray-800 font-bold">+</button>
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {subNotes.map(note => (
                <motion.div 
                  layout
                  key={note.id} 
                  className="flex items-center gap-3 bg-white p-3 border-2 border-black rounded shadow-sm group"
                >
                    <button 
                      onClick={() => toggleSubNote(note.id)}
                      className={`w-6 h-6 border-2 border-black rounded flex items-center justify-center ${note.isCompleted ? 'bg-neo-primary' : 'bg-white'}`}
                    >
                      {note.isCompleted && <CheckSquare size={14} className="text-black" />}
                    </button>
                    <span className={`flex-1 font-bold text-black ${note.isCompleted ? 'line-through text-gray-500' : ''}`}>
                      {note.content}
                    </span>
                    <button 
                      onClick={() => deleteSubNote(note.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                </motion.div>
              ))}
              {subNotes.length === 0 && <p className="text-sm text-gray-500 text-center italic">No tasks yet.</p>}
            </div>
        </div>
      )}
    </div>
  );

  // Build Sticky Footer for Event Drawer
  const renderEventDrawerFooter = () => {
    if (isViewMode && editingEvent) {
      return (
        <NeoButton fullWidth onClick={handleSave} variant="primary">
           <Save size={20} /> SAVE NOTES
        </NeoButton>
      );
    }
    if (!isViewMode) {
      return (
        <div className="flex gap-3">
          {editingEvent && (
              <NeoButton variant="danger" onClick={handleDelete} className="!px-4">
                <Trash2 size={20} />
              </NeoButton>
          )}
          <NeoButton fullWidth onClick={handleSave}>
              {editingEvent ? 'UPDATE SETTINGS' : 'CREATE EVENT'}
          </NeoButton>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen pb-24 text-black">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-neo-bg/90 backdrop-blur-md border-b-2 border-black px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-black rounded-full animate-pulse"></div>
           <h1 className="text-xl font-black italic tracking-tighter text-black">NEO-COUNT</h1>
        </div>
        
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 border-2 border-black rounded-lg hover:bg-black hover:text-white text-black transition-colors"
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Grid Content */}
      <main className="p-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <CountdownCard 
              key={event.id} 
              event={event} 
              onClick={() => handleOpenEdit(event)} 
            />
          ))}
          
          {/* Empty State / Add Card */}
          <motion.button
            whileHover={{ scale: 1.02, rotate: 1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenAdd}
            className="
              min-h-[250px] 
              border-4 border-dashed border-gray-400 hover:border-black 
              rounded-xl 
              flex flex-col items-center justify-center 
              text-gray-500 hover:text-black
              transition-colors
              group
              bg-white/50
            "
          >
            <div className="bg-gray-100 group-hover:bg-neo-primary p-4 rounded-full border-2 border-gray-300 group-hover:border-black transition-colors mb-4 text-black">
               <Plus size={32} />
            </div>
            <span className="font-bold text-lg">ADD NEW COUNTDOWN</span>
          </motion.button>
        </div>
      </main>

      {/* Settings Drawer */}
      <Drawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Settings & Account"
      >
        <div className="space-y-8">
           <div className="bg-gray-50 p-6 rounded-xl border-2 border-black">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-16 h-16 bg-neo-accent rounded-full border-2 border-black flex items-center justify-center text-2xl font-black text-black">
                    {user.name.charAt(0).toUpperCase()}
                 </div>
                 <div>
                    <h3 className="font-bold text-xl text-black">{user.name}</h3>
                    <p className="text-sm text-gray-700">{user.email}</p>
                 </div>
              </div>
              <NeoButton onClick={onLogout} variant="outline" className="text-sm w-full">
                <LogOut size={16} /> Sign Out
              </NeoButton>
           </div>

           <div>
              <h4 className="font-black text-lg mb-4 uppercase text-black">Notifications</h4>
              <div className="flex items-center justify-between bg-white p-4 border-2 border-black rounded-lg shadow-neo-sm">
                 <div className="flex items-center gap-3 text-black">
                    {pushEnabled ? <Bell className="text-neo-primary fill-black" /> : <BellOff />}
                    <span className="font-bold">Push Notifications</span>
                 </div>
                 <button 
                  onClick={togglePush}
                  className={`
                    w-14 h-8 rounded-full border-2 border-black p-1 transition-colors relative
                    ${pushEnabled ? 'bg-black' : 'bg-gray-200'}
                  `}
                 >
                   <div className={`
                     w-5 h-5 bg-white border-2 border-black rounded-full absolute top-1 transition-all
                     ${pushEnabled ? 'left-7' : 'left-1'}
                   `} />
                 </button>
              </div>
              <p className="text-xs text-gray-700 mt-2 font-medium">
                Get notified when your countdown hits zero. Requires browser permission.
              </p>
           </div>

           <div>
              <h4 className="font-black text-lg mb-4 uppercase text-black">App Install</h4>
              {canInstall ? (
                <NeoButton onClick={installPWA} variant="secondary" fullWidth>
                  <Download size={20} /> Install App (PWA)
                </NeoButton>
              ) : (
                <div className="text-gray-400 text-center text-sm font-medium py-2">
                  App đã được cài đặt hoặc không khả dụng để cài đặt.
                </div>
              )}
           </div>
        </div>
      </Drawer>

      {/* Event Editor/Viewer Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={isViewMode ? "Event Details" : (editingEvent ? "Edit Event" : "New Event")}
        footer={renderEventDrawerFooter()}
      >
        {isViewMode && editingEvent ? (
          /* --- VIEW MODE --- */
          <div className="flex flex-col h-full pb-2">
            <div className="space-y-6">
               {/* Color & Category Header */}
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full border-2 border-black" style={{ backgroundColor: editingEvent.themeColor }} />
                      <span className="px-3 py-1 border-2 border-black rounded-full text-xs font-black uppercase bg-gray-100">
                        {editingEvent.category}
                      </span>
                  </div>
                  <button 
                    onClick={switchToEditMode}
                    className="text-xs font-bold underline flex items-center gap-1 text-gray-500 hover:text-black"
                  >
                    <Pencil size={12} /> Full Edit
                  </button>
               </div>

               {/* Title */}
               <div>
                 <h2 className="text-5xl font-black uppercase leading-none break-words tracking-tight">
                   {editingEvent.name}
                 </h2>
               </div>

               {/* Target Date Display */}
               <div className="bg-gray-50 border-2 border-black p-6 rounded-xl">
                 <div className="flex items-center gap-2 mb-2 text-gray-600 font-bold uppercase text-xs tracking-widest">
                    <Calendar size={14} /> Target Date
                 </div>
                 <p className="text-3xl font-black text-black">
                   {new Date(editingEvent.targetDate).toLocaleDateString(undefined, { 
                     weekday: 'long', 
                     year: 'numeric', 
                     month: 'long', 
                     day: 'numeric' 
                   })}
                 </p>
                 <p className="text-xl font-bold text-gray-600 mt-1">
                    {new Date(editingEvent.targetDate).toLocaleTimeString(undefined, {
                       hour: '2-digit',
                       minute: '2-digit'
                    })}
                 </p>
               </div>

               {/* Editable Note Section in View Mode */}
               {renderNoteInputSection()}
            </div>
          </div>
        ) : (
          /* --- EDIT MODE --- */
          <div className="space-y-6 pb-2">
            {/* Back button if editing existing */}
            {editingEvent && (
              <button 
                onClick={() => setIsViewMode(true)}
                className="flex items-center gap-2 text-gray-500 hover:text-black font-bold text-sm mb-2"
              >
                 <ArrowLeft size={16} /> Back to View
              </button>
            )}

            <NeoInput 
              label="Event Name" 
              placeholder="e.g. Project Launch" 
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />

            <div>
              <label className="font-bold text-sm ml-1 uppercase block mb-1 text-black">Target Date</label>
              <WheelPicker date={formDate} onDateChange={setFormDate} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="font-bold text-sm ml-1 uppercase block mb-1 text-black">Category</label>
                  <select 
                    className="w-full bg-white text-black border-2 border-black shadow-neo-sm p-3 rounded-md font-bold focus:outline-none"
                    value={formCategory}
                    onChange={(e: any) => setFormCategory(e.target.value)}
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="trip">Trip</option>
                    <option value="other">Other</option>
                  </select>
              </div>
              <div>
                  <label className="font-bold text-sm ml-1 uppercase block mb-1 text-black">Color</label>
                  <div className="flex gap-2">
                    {['#B8FF9F', '#FF9F9F', '#9FDDFF', '#FFF59F'].map(c => (
                      <button
                        key={c}
                        onClick={() => setFormTheme(c)}
                        className={`w-10 h-10 rounded-full border-2 border-black ${formTheme === c ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Dashboard;