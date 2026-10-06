import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  User,
  FileText,
  Bell,
  Trash2,
  CheckCircle2,
  Stethoscope,
  FlaskConical,
  Syringe,
  Pill,
  Heart,
  Pin,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { DEFAULT_AGENDA_EVENTS } from '../data';
import { AgendaEvent, AgendaEventType } from '../types';
import { OREASymbol } from './OREALogo';
import oreaAgendaScheduleImg from '../assets/images/orea_agenda_schedule_1788513869889.jpg';

interface OreaAgendaViewProps {
  onBackToHome: () => void;
}

export const OreaAgendaView: React.FC<OreaAgendaViewProps> = ({ onBackToHome }) => {
  const [viewMode, setViewMode] = useState<'mois' | 'semaine' | 'jour'>('mois');
  const [events, setEvents] = useState<AgendaEvent[]>(() => {
    try {
      const saved = localStorage.getItem('orea_agenda_events');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_AGENDA_EVENTS;
  });

  // Modal for new event
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const [newType, setNewType] = useState<AgendaEventType>('rdv');
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-09-12');
  const [newTime, setNewTime] = useState('10:30');
  const [newLocation, setNewLocation] = useState('');
  const [newPractitioner, setNewPractitioner] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newReminderNotice, setNewReminderNotice] = useState<'none' | '1h' | '2h' | '24h' | '48h'>('24h');

  // Selected date filter
  const [currentMonth, setCurrentMonth] = useState('Septembre 2026');

  useEffect(() => {
    try {
      localStorage.setItem('orea_agenda_events', JSON.stringify(events));
    } catch {
      // ignore
    }
  }, [events]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEvent: AgendaEvent = {
      id: 'evt-' + Date.now(),
      type: newType,
      title: newTitle.trim(),
      date: newDate,
      time: newTime,
      location: newLocation.trim() || 'Cabinet médical',
      practitioner: newPractitioner.trim(),
      notes: newNotes.trim(),
      reminderNotice: newReminderNotice,
      completed: false,
    };

    setEvents([...events, newEvent].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)));
    setIsNewEventOpen(false);

    // Reset fields
    setNewTitle('');
    setNewLocation('');
    setNewPractitioner('');
    setNewNotes('');
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setEvents(
      events.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
    );
  };

  // Helper for type styling and icons
  const getTypeBadge = (type: AgendaEventType) => {
    switch (type) {
      case 'rdv':
        return {
          label: 'Rendez-vous médical',
          icon: <Stethoscope className="w-3.5 h-3.5" />,
          color: 'bg-blue-50 text-[#2563eb] border-blue-200',
        };
      case 'examen':
        return {
          label: 'Examen de santé',
          icon: <FlaskConical className="w-3.5 h-3.5" />,
          color: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'vaccination':
        return {
          label: 'Vaccination',
          icon: <Syringe className="w-3.5 h-3.5" />,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'rappel_med':
        return {
          label: 'Rappel médicament',
          icon: <Pill className="w-3.5 h-3.5" />,
          color: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'suivi':
        return {
          label: 'Suivi santé',
          icon: <Heart className="w-3.5 h-3.5" />,
          color: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      default:
        return {
          label: 'Rappel personnel',
          icon: <Pin className="w-3.5 h-3.5" />,
          color: 'bg-slate-50 text-slate-700 border-slate-200',
        };
    }
  };

  return (
    <div className="w-full bg-[#f8fbfe] min-h-screen py-8 sm:py-12">
      <div className="max-w-[1520px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#d8ebfa] text-[#1e293b] hover:text-[#2563eb] hover:bg-[#eff6ff] text-sm font-medium transition-colors shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </button>
          <span className="text-slate-400">/</span>
          <div className="inline-flex items-center gap-1.5">
            <OREASymbol className="w-4 h-4" />
            <span className="text-sm font-semibold text-[#0056d6]">OREA Agenda Santé</span>
          </div>
        </div>

        {/* Header Hero with Image 4 Integration */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#dbeaf8] p-6 sm:p-10 shadow-[0_4px_24px_rgba(37,99,235,0.04)] mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eff6ff] border border-[#dbeafe] text-[#0056d6] text-xs font-semibold mb-3">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Parcours de soins & Événements Médicaux</span>
              </div>
              <h1 className="text-[32px] sm:text-[40px] font-extrabold text-[#0f2347] tracking-tight leading-tight">
                Votre santé, organisée simplement.
              </h1>
              <p className="text-[15px] sm:text-[16px] text-[#64748b] mt-2 max-w-xl leading-relaxed">
                Rendez-vous médicaux, examens, vaccinations et rappels de santé centralisés pour vous et vos proches en un clic.
              </p>

              {/* "+ Ajouter" Primary Action Button */}
              <div className="mt-5">
                <button
                  onClick={() => setIsNewEventOpen(true)}
                  className="px-6 py-3 rounded-xl bg-[#0056d6] hover:bg-[#0041a3] active:scale-[0.98] text-white font-bold text-sm shadow-[0_4px_14px_rgba(0,86,214,0.25)] flex items-center gap-2.5 transition-all cursor-pointer"
                >
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
                  <span>+ Ajouter un événement</span>
                </button>
              </div>
            </div>

            {/* Photo Column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#cfe2f5] group">
                <img
                  src={oreaAgendaScheduleImg}
                  alt="Femme organisant sereinement son calendrier et ses rendez-vous médicaux sur sa tablette"
                  className="w-full h-48 sm:h-56 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-3 right-3 text-white text-[11.5px] font-medium drop-shadow-sm flex items-center justify-between">
                  <span>Planification fluide & rappels de soins</span>
                  <span className="font-bold text-blue-200">OREA Agenda</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar View Controls Bar */}
          <div className="mt-8 pt-6 border-t border-[#f0f4f9] flex flex-wrap items-center justify-between gap-4">
            {/* View Mode Toggle: Mois, Semaine, Jour */}
            <div className="flex items-center gap-1.5 bg-[#f1f5f9] p-1 rounded-xl">
              <button
                onClick={() => setViewMode('mois')}
                className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  viewMode === 'mois'
                    ? 'bg-white text-[#2563eb] shadow-xs'
                    : 'text-slate-600 hover:text-[#0f2347]'
                }`}
              >
                Mois
              </button>
              <button
                onClick={() => setViewMode('semaine')}
                className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  viewMode === 'semaine'
                    ? 'bg-white text-[#2563eb] shadow-xs'
                    : 'text-slate-600 hover:text-[#0f2347]'
                }`}
              >
                Semaine
              </button>
              <button
                onClick={() => setViewMode('jour')}
                className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  viewMode === 'jour'
                    ? 'bg-white text-[#2563eb] shadow-xs'
                    : 'text-slate-600 hover:text-[#0f2347]'
                }`}
              >
                Liste / Jour
              </button>
            </div>

            {/* Month selector indicator */}
            <div className="flex items-center gap-3">
              <button className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-[#0f2347] min-w-[140px] text-center">
                {currentMonth}
              </span>
              <button className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid Representation in "Mois" view */}
        {viewMode === 'mois' && (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#dbeaf8] p-5 sm:p-7 shadow-[0_4px_24px_rgba(37,99,235,0.04)] mb-8 overflow-x-auto">
            <div className="grid grid-cols-7 gap-2 min-w-[700px] text-center mb-3">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d, i) => (
                <div key={i} className="text-xs font-bold uppercase text-[#64748b] py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid sample (September 2026 starts on Tuesday) */}
            <div className="grid grid-cols-7 gap-2 min-w-[700px]">
              {/* Previous month filler */}
              <div className="h-24 p-2 bg-slate-50/50 rounded-xl text-xs text-slate-300 border border-slate-100">
                31
              </div>

              {/* Days 1 to 30 */}
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                const dateStr = `2026-09-${day < 10 ? '0' + day : day}`;
                const dayEvents = events.filter((e) => e.date === dateStr);
                const isToday = day === 4;

                return (
                  <div
                    key={day}
                    className={`h-28 p-2 rounded-xl border flex flex-col justify-between transition-colors ${
                      isToday
                        ? 'bg-[#eff6ff] border-[#93c5fd] shadow-xs'
                        : 'bg-white border-[#e2edf8] hover:border-[#93c5fd]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-extrabold ${
                          isToday
                            ? 'w-5 h-5 rounded-full bg-[#2563eb] text-white flex items-center justify-center'
                            : 'text-[#0f2347]'
                        }`}
                      >
                        {day}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                      )}
                    </div>

                    <div className="space-y-1 overflow-y-auto max-h-16">
                      {dayEvents.map((evt) => {
                        const badge = getTypeBadge(evt.type);
                        return (
                          <div
                            key={evt.id}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium truncate flex items-center gap-1 border ${badge.color}`}
                            title={`${evt.time} - ${evt.title}`}
                          >
                            <span className="font-bold">{evt.time}</span>
                            <span className="truncate">{evt.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detailed Events Timeline / List */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#dbeaf8] p-6 sm:p-8 shadow-[0_4px_24px_rgba(37,99,235,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[20px] font-extrabold text-[#0f2347] tracking-tight">
                Événements à venir ({events.length})
              </h3>
              <p className="text-xs text-[#64748b]">
                Organisez vos consultations, ordonnances et rendez-vous médicaux
              </p>
            </div>
            <button
              onClick={() => setIsNewEventOpen(true)}
              className="text-xs font-bold text-[#2563eb] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un rappel</span>
            </button>
          </div>

          {events.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-[#dce9f6] rounded-2xl">
              <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-base font-bold text-[#0f2347]">Votre agenda santé est vide</p>
              <p className="text-xs text-[#64748b] mt-1">
                Cliquez sur "+ Ajouter" pour planifier votre prochain rendez-vous médical ou examen.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {events.map((evt) => {
                const badge = getTypeBadge(evt.type);

                return (
                  <div
                    key={evt.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      evt.completed
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white border-[#dce9f6] hover:border-[#93c5fd] hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Check completed button */}
                      <button
                        onClick={() => handleToggleComplete(evt.id)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center border transition-colors shrink-0 mt-0.5 cursor-pointer ${
                          evt.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 hover:border-slate-400 bg-white'
                        }`}
                        title="Marquer comme effectué"
                      >
                        {evt.completed && <CheckCircle2 className="w-5 h-5" />}
                      </button>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border flex items-center gap-1.5 ${badge.color}`}
                          >
                            {badge.icon}
                            <span>{badge.label}</span>
                          </span>

                          <span className="text-xs font-extrabold text-[#0f2347] bg-slate-100 px-2 py-0.5 rounded">
                            📅 {evt.date} à {evt.time}
                          </span>

                          {evt.reminderNotice !== 'none' && (
                            <span className="text-[10.5px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                              <Bell className="w-3 h-3" />
                              <span>Rappel {evt.reminderNotice} avant</span>
                            </span>
                          )}
                        </div>

                        <h4 className={`text-[17px] font-bold text-[#0f2347] ${evt.completed ? 'line-through' : ''}`}>
                          {evt.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                          {evt.practitioner && (
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <strong>{evt.practitioner}</strong>
                            </span>
                          )}

                          {evt.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{evt.location}</span>
                            </span>
                          )}
                        </div>

                        {evt.notes && (
                          <p className="text-xs text-slate-500 italic flex items-start gap-1 pt-1">
                            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>{evt.notes}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Delete action */}
                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => handleDeleteEvent(evt.id)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Supprimer cet événement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL: ADD AGENDA EVENT */}
        {isNewEventOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#dbeaf8] p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#eff6ff] text-[#2563eb] flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0f2347]">Ajouter à mon agenda santé</h3>
                </div>
                <button
                  onClick={() => setIsNewEventOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-4">
                {/* Event Type */}
                <div>
                  <label className="block text-xs font-bold text-[#0f2347] mb-1">
                    Type d'événement *
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as AgendaEventType)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cfe2f5] text-sm text-[#0f2347] focus:border-[#2563eb] outline-none bg-white"
                  >
                    <option value="rdv">🩺 Rendez-vous médical</option>
                    <option value="examen">🧪 Examen / Analyse</option>
                    <option value="vaccination">💉 Vaccination</option>
                    <option value="rappel_med">💊 Rappel médicament</option>
                    <option value="suivi">❤️ Suivi santé</option>
                    <option value="autre">📌 Autre rappel</option>
                  </select>
                </div>

                {/* Event Title */}
                <div>
                  <label className="block text-xs font-bold text-[#0f2347] mb-1">
                    Titre du rendez-vous *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Consultation générale, Bilan dentaire..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cfe2f5] text-sm text-[#0f2347] focus:border-[#2563eb] outline-none"
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0f2347] mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#cfe2f5] text-sm text-[#0f2347] focus:border-[#2563eb] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0f2347] mb-1">
                      Heure *
                    </label>
                    <input
                      type="time"
                      required
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#cfe2f5] text-sm text-[#0f2347] focus:border-[#2563eb] outline-none"
                    />
                  </div>
                </div>

                {/* Location & Practitioner */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0f2347] mb-1">
                      Lieu / Adresse
                    </label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="Ex: Centre médical Bastille"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#cfe2f5] text-sm text-[#0f2347] focus:border-[#2563eb] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0f2347] mb-1">
                      Professionnel de santé
                    </label>
                    <input
                      type="text"
                      value={newPractitioner}
                      onChange={(e) => setNewPractitioner(e.target.value)}
                      placeholder="Ex: Dr. Martin"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#cfe2f5] text-sm text-[#0f2347] focus:border-[#2563eb] outline-none"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-[#0f2347] mb-1">
                    Notes & Consignes
                  </label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Ex: Apporter les résultats précédents, être à jeun..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cfe2f5] text-sm text-[#0f2347] focus:border-[#2563eb] outline-none"
                  />
                </div>

                {/* Notification timing */}
                <div>
                  <label className="block text-xs font-bold text-[#0f2347] mb-1">
                    Rappel de notification
                  </label>
                  <select
                    value={newReminderNotice}
                    onChange={(e) => setNewReminderNotice(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cfe2f5] text-sm text-[#0f2347] focus:border-[#2563eb] outline-none bg-white"
                  >
                    <option value="24h">24 heures avant</option>
                    <option value="48h">48 heures avant</option>
                    <option value="2h">2 heures avant</option>
                    <option value="1h">1 heure avant</option>
                    <option value="none">Aucun rappel</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-[#f0f4f9] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewEventOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Enregistrer l'événement
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
