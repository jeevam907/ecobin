/**
 * EcoBin Configuration & Data Models
 * Master Constants, SLA Timelines, Categories & Smart City Data
 */

export const APP_CONFIG = {
  name: 'EcoBin',
  tagline: 'Spot the Waste. Report in Seconds. Track Until Clean.',
  version: '1.0.0-phase1',
  supportEmail: 'support@ecobin.city',
  city: 'Metropolis Smart Municipal District',
  defaultLanguage: 'en',
  languages: [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' }
  ],
  roles: {
    GUEST: 'guest',
    CITIZEN: 'citizen',
    OFFICER: 'officer',
    ADMIN: 'admin'
  },
  categories: [
    { id: 'uncollected', name: 'Uncollected Garbage', icon: 'trash-2', color: '#0ea5e9' },
    { id: 'overflowing', name: 'Overflowing Smart Bin', icon: 'archive', color: '#f59e0b' },
    { id: 'dumping', name: 'Illegal Roadside Dumping', icon: 'alert-triangle', color: '#ef4444' },
    { id: 'drain_blocked', name: 'Blocked Drain with Waste', icon: 'droplet', color: '#06b6d4' },
    { id: 'hazardous', name: 'Hazardous / E-Waste', icon: 'zap', color: '#a855f7' },
    { id: 'other', name: 'Other Sanitation Issue', icon: 'help-circle', color: '#10b981' }
  ],
  severities: [
    { id: 'low', name: 'Low Priority', slaHours: 72, color: '#10b981' },
    { id: 'medium', name: 'Medium Priority', slaHours: 24, color: '#38bdf8' },
    { id: 'high', name: 'High Priority', slaHours: 12, color: '#f59e0b' },
    { id: 'critical', name: 'Critical Emergency', slaHours: 4, color: '#ef4444' }
  ],
  statuses: [
    { id: 'submitted', label: 'Submitted', color: '#38bdf8' },
    { id: 'assigned', label: 'Assigned', color: '#fbbf24' },
    { id: 'in_progress', label: 'In Progress', color: '#c084fc' },
    { id: 'resolved', label: 'Resolved', color: '#34d399' },
    { id: 'closed', label: 'Closed & Verified', color: '#10b981' }
  ]
};

// Initial Seed Data for Phase 1 Preview & Mock State
export const SAMPLE_COMPLAINTS = [
  {
    id: 'ECO-2026-8941',
    category: 'Overflowing Smart Bin',
    severity: 'critical',
    status: 'in_progress',
    address: '4th Cross, Green Glen Layout, Bellandur Ward 150',
    ward: 'Ward 150 - Bellandur',
    submittedAt: '2026-10-29 08:30 AM',
    assignedOfficer: 'Officer Rajesh Kumar',
    etaHours: 2,
    photos: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80'],
    description: 'Smart Bin #B-104 is overflowing onto the pedestrian pathway. Sensor reported 98% full.',
    lat: 12.9260,
    lng: 77.6762
  },
  {
    id: 'ECO-2026-8940',
    category: 'Illegal Roadside Dumping',
    severity: 'high',
    status: 'assigned',
    address: 'Near Indiranagar Metro Pillar #42',
    ward: 'Ward 72 - Indiranagar',
    submittedAt: '2026-10-29 09:15 AM',
    assignedOfficer: 'Officer Sarah Chen',
    etaHours: 8,
    photos: ['https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80'],
    description: 'Commercial debris dumped overnight near the metro staircase.',
    lat: 12.9784,
    lng: 77.6408
  },
  {
    id: 'ECO-2026-8935',
    category: 'Uncollected Garbage',
    severity: 'medium',
    status: 'resolved',
    address: '12th Main, 5th Sector, HSR Layout',
    ward: 'Ward 174 - HSR Layout',
    submittedAt: '2026-10-28 02:40 PM',
    resolvedAt: '2026-10-29 11:10 AM',
    assignedOfficer: 'Officer Ramesh Patel',
    rating: 5,
    photos: ['https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=600&q=80'],
    description: 'Door-to-door collection missed block 5 yesterday.',
    lat: 12.9121,
    lng: 77.6446
  }
];

export const SAMPLE_BINS = [
  {
    id: 'BIN-101',
    zone: 'East Zone',
    ward: 'Ward 150',
    location: 'Central Plaza Bus Shelter',
    type: 'Smart Recyclable (Dry)',
    fillLevel: 35,
    status: 'ok',
    lat: 12.9345,
    lng: 77.6821,
    lastEmptied: '2 hours ago'
  },
  {
    id: 'BIN-102',
    zone: 'East Zone',
    ward: 'Ward 150',
    location: 'EcoPark South Gate',
    type: 'Organic (Wet)',
    fillLevel: 78,
    status: 'warning',
    lat: 12.9310,
    lng: 77.6790,
    lastEmptied: '6 hours ago'
  },
  {
    id: 'BIN-103',
    zone: 'East Zone',
    ward: 'Ward 150',
    location: 'Tech Park Metro Entrance',
    type: 'Mixed Solid Waste',
    fillLevel: 94,
    status: 'critical',
    lat: 12.9280,
    lng: 77.6740,
    lastEmptied: '14 hours ago'
  }
];
