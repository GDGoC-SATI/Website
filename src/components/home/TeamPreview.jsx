import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaWhatsapp, FaEdit } from 'react-icons/fa';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ItemEditorModal } from '../admin/AdminModals';

const TeamCard = ({ card, isAdmin, onEdit }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300 group flex flex-col h-full p-4 relative">
    {isAdmin && (
      <button
        onClick={() => onEdit(card)}
        className="absolute top-6 right-6 z-20 p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 hover:bg-google-blue hover:text-white text-slate-700 dark:text-slate-200 shadow-md backdrop-blur-md transition-all text-xs"
        title="Configure Card"
      >
        <FaEdit />
      </button>
    )}

    <div className="h-48 overflow-hidden relative rounded-2xl bg-slate-100 dark:bg-slate-800">
      <img
        src={card.image}
        alt={card.title}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        onError={(e) => {
          e.target.src = '/assets/core team/technical_team.jpeg';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{card.title}</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed flex-grow">
        {card.description}
      </p>
    </div>
  </div>
);

const CTACard = ({ cta, isAdmin, onEdit }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300 group flex flex-col h-full p-4 relative">
    {isAdmin && (
      <button
        onClick={() => onEdit(cta)}
        className="absolute top-6 right-6 z-20 p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 hover:bg-google-blue hover:text-white text-slate-700 dark:text-slate-200 shadow-md backdrop-blur-md transition-all text-xs"
        title="Configure Community Card"
      >
        <FaEdit />
      </button>
    )}

    <div className="h-48 overflow-hidden relative rounded-2xl bg-slate-100 dark:bg-slate-800">
      <img
        src={cta.image || '/assets/core team/group_image3.jpeg'}
        alt="Community"
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        onError={(e) => {
          e.target.src = '/assets/core team/group_image3.jpeg';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{cta.title}</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed flex-grow">
        {cta.description}
      </p>
      <a
        href={cta.link || 'https://chat.whatsapp.com/HY4x1jtPfbh6EDh1JPFWda'}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-sm font-semibold text-green-600 hover:text-green-700 transition-colors mt-auto"
      >
        Join Now <FaArrowRight className="ml-1 text-xs group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  </div>
);

const defaultData = {
  title: 'Meet The Team',
  description:
    'The passionate individuals who make everything possible. From coding to event management, our diverse team works together to deliver the best experience.',
  cards: [
    {
      id: 'technical',
      title: 'Technical Team',
      description:
        'Architects of digital innovation, crafting robust solutions and pioneering future technologies to build a smarter world.',
      image: '/assets/core team/technical_team.jpeg',
    },
    {
      id: 'social',
      title: 'Social Media Team',
      description:
        'The digital storytellers, amplifying our voice and connecting with the community through engaging and creative content.',
      image: '/assets/core team/social_team.jpeg',
    },
    {
      id: 'events',
      title: 'Events Team',
      description:
        'The masterminds behind the curtain, orchestrating seamless experiences that bring people together and spark inspiration.',
      image: '/assets/core team/events_team.jpeg',
    },
    {
      id: 'management',
      title: 'Marketing & Finance',
      description:
        'The strategic engines, driving growth and ensuring sustainable success through smart resource management and outreach.',
      image: '/assets/core team/management_team.jpeg',
    },
  ],
  cta: {
    id: 'cta',
    title: 'Join Our whatsapp community and be the part of it!!',
    description: 'The Nexus of Next, Where Minds Merge to Redefine Tomorrow. be the part of it!!',
    image: '/assets/core team/group_image3.jpeg',
    link: 'https://chat.whatsapp.com/HY4x1jtPfbh6EDh1JPFWda',
  },
};

const TeamPreview = () => {
  const [sectionData, setSectionData] = useState(defaultData);
  const { isAdmin } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState(null);

  useEffect(() => {
    const loadSection = async () => {
      try {
        const res = await api.sections.get('meet_the_team');
        if (res.success && res.data && res.data.data) {
          setSectionData({
            title: res.data.title || defaultData.title,
            description: res.data.description || defaultData.description,
            cards: res.data.data.cards || defaultData.cards,
            cta: res.data.data.cta || defaultData.cta,
          });
        }
      } catch (err) {
        console.warn('Using default section data:', err);
      }
    };
    loadSection();
  }, []);

  const handleEditCard = (card) => {
    setCardToEdit(card);
    setIsEditModalOpen(true);
  };

  const handleSaveCard = async (formData) => {
    let updatedCards = [...sectionData.cards];
    let updatedCta = { ...sectionData.cta };

    if (formData.id === 'cta') {
      updatedCta = { ...updatedCta, ...formData };
    } else {
      updatedCards = updatedCards.map((c) => (c.id === formData.id ? { ...c, ...formData } : c));
    }

    const payload = {
      title: sectionData.title,
      description: sectionData.description,
      data: {
        cards: updatedCards,
        cta: updatedCta,
      },
    };

    setSectionData((prev) => ({
      ...prev,
      cards: updatedCards,
      cta: updatedCta,
    }));

    await api.sections.update('meet_the_team', payload);
  };

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Meet The <span className="text-google-blue">Team</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {sectionData.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectionData.cards.map((card) => (
            <TeamCard
              key={card.id || card.title}
              card={card}
              isAdmin={isAdmin}
              onEdit={handleEditCard}
            />
          ))}
          <div className="lg:col-span-2">
            <CTACard
              cta={sectionData.cta}
              isAdmin={isAdmin}
              onEdit={handleEditCard}
            />
          </div>
        </div>
      </div>

      <ItemEditorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveCard}
        item={cardToEdit}
        type="sectionCard"
        title={`Configure ${cardToEdit?.title || 'Section Card'}`}
      />
    </section>
  );
};

export default TeamPreview;
