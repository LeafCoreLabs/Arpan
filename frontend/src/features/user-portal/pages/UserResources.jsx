import { useState } from 'react'
import { Building2, Phone, MapPin, Search } from 'lucide-react'

const CATEGORIES = ['All', 'Medical', 'Shelter', 'Food', 'Legal', 'Mental Health']
const catColor = { Medical: '#ef4444', Shelter: '#3b82f6', Food: '#f59e0b', Legal: '#8b5cf6', 'Mental Health': '#ec4899' }

const RESOURCES = [
  { name: 'AIIMS Hospital', type: 'Medical', address: 'Ansari Nagar, New Delhi', phone: '011-2658-8500', desc: 'Premier government hospital with 24/7 emergency' },
  { name: 'Safdarjung Hospital', type: 'Medical', address: 'Ansari Nagar West, Delhi', phone: '011-2673-0000', desc: 'Multi-specialty government hospital' },
  { name: 'Night Shelter - Nizamuddin', type: 'Shelter', address: 'Nizamuddin Basti, Delhi', phone: '1800-111-555', desc: 'Government-run night shelter with 200 beds' },
  { name: 'Night Shelter - Kashmere Gate', type: 'Shelter', address: 'ISBT, Kashmere Gate', phone: '1800-111-555', desc: 'Heated shelter near bus terminal' },
  { name: 'Akshaya Patra Kitchen', type: 'Food', address: 'Vrindavan, UP', phone: '080-3014-3400', desc: 'Free mid-day meals for communities' },
  { name: 'Gurdwara Bangla Sahib Langar', type: 'Food', address: 'Connaught Place, Delhi', phone: 'N/A', desc: 'Free community meals served 24/7' },
  { name: 'Delhi Legal Services Auth.', type: 'Legal', address: 'Patiala House Courts, Delhi', phone: '011-2338-3637', desc: 'Free legal aid for eligible persons' },
  { name: 'NALSA', type: 'Legal', address: 'Supreme Court Complex, Delhi', phone: '011-2338-7263', desc: 'National Legal Services Authority' },
  { name: 'iCall - TISS', type: 'Mental Health', address: 'Mumbai (Tele-counseling)', phone: '9152987821', desc: 'Free psychosocial helpline by TISS' },
  { name: 'Vandrevala Foundation', type: 'Mental Health', address: 'Pan-India (Helpline)', phone: '1860-2662-345', desc: '24/7 free mental health counseling' },
  { name: 'Ram Manohar Lohia Hospital', type: 'Medical', address: 'Baba Kharak Singh Marg, Delhi', phone: '011-2336-5525', desc: 'Government hospital with trauma center' },
  { name: 'Missionaries of Charity', type: 'Shelter', address: 'Various locations, Delhi', phone: 'N/A', desc: 'Shelters for homeless and destitute' },
]

export default function UserResources() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = RESOURCES.filter(r =>
    (category === 'All' || r.type === category) &&
    (search === '' || r.name.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="af-dashboard">
      <div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={20} style={{ color: '#8b5cf6' }} /> Resource Directory
        </h1>
        <p style={{ color: 'var(--af-muted)', fontSize: '0.85rem', margin: 0 }}>Find nearby hospitals, shelters, food services, and helplines.</p>
      </div>

      {/* Search + Category Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 250px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
          <input className="searchbar" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources..." style={{ paddingLeft: '2rem' }} />
        </div>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`btn ${category === c ? 'btn--primary' : 'btn--ghost'}`}
            style={{ fontSize: '0.8rem' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state__title">No resources found</h3>
          <p className="empty-state__desc">Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '0.75rem' }}>
          {filtered.map((r, i) => (
            <div key={i} className="af-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                <h4 style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>{r.name}</h4>
                <span className="badge" style={{ background: `${catColor[r.type] || '#10b981'}12`, color: catColor[r.type] || '#10b981' }}>{r.type}</span>
              </div>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: 'var(--af-muted)', lineHeight: 1.4 }}>{r.desc}</p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--af-muted)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={12} />{r.address}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Phone size={12} style={{ color: '#10b981' }} />
                  <a href={`tel:${r.phone}`} style={{ color: '#10b981', textDecoration: 'none', fontWeight: 500 }}>{r.phone}</a>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
