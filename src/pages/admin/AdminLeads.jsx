import { Trash2 } from 'lucide-react'

export default function AdminLeads({ leads, onDeleteLead }) {
    return (
        <div>
            <h2 style={{ margin: '0 0 1.5rem', color: '#0f172a' }}>Incoming Inquiries ({leads.length})</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', color: '#1e293b' }}>Date</th>
                            <th style={{ padding: '1rem', color: '#1e293b' }}>Name</th>
                            <th style={{ padding: '1rem', color: '#1e293b' }}>Contact</th>
                            <th style={{ padding: '1rem', color: '#1e293b' }}>Service</th>
                            <th style={{ padding: '1rem', color: '#1e293b' }}>Message</th>
                            <th style={{ padding: '1rem', color: '#1e293b', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...leads].reverse().map((lead, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '1rem', color: '#1e293b', whiteSpace: 'nowrap' }}>{new Date(lead.timestamp).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem', fontWeight: 600, color: '#0f172a' }}>{lead.name}</td>
                                <td style={{ padding: '1rem', color: '#3730a3' }}>{lead.contact}</td>
                                <td style={{ padding: '1rem' }}><span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#1e293b' }}>{lead.service}</span></td>
                                <td style={{ padding: '1rem', color: '#1e293b', minWidth: '300px' }}>{lead.message}</td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button aria-label="Delete Lead" onClick={() => onDeleteLead(lead.id)} style={{ background: '#fef2f2', color: '#b91c1c', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
