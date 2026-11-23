/**
 * Realistic initial demo records for News Blog Performance Optimization Dashboard
 */

export const DEMO_OPTIMIZATION_RECORDS = [
  {
    id: 'opt-101',
    title: 'Convert Hero Images to AVIF/WebP',
    category: 'Image Optimization',
    priority: 'High',
    status: 'Completed',
    assignedStaff: 'Elena Rostova',
    description: 'Compress and serve next-gen image formats with responsive srcset to reduce Largest Contentful Paint (LCP) from 3.8s to under 1.8s.',
    createdAt: '2026-11-10T09:30:00.000Z',
  },
  {
    id: 'opt-102',
    title: 'Implement Route-Based Code Splitting',
    category: 'Code Splitting',
    priority: 'High',
    status: 'In Progress',
    assignedStaff: 'Marcus Vance',
    description: 'Use React.lazy and dynamic imports for article viewer and comments section to reduce initial JavaScript bundle size by 42%.',
    createdAt: '2026-11-12T11:15:00.000Z',
  },
  {
    id: 'opt-103',
    title: 'Configure Stale-While-Revalidate CDN Caching',
    category: 'Caching',
    priority: 'Medium',
    status: 'Pending',
    assignedStaff: 'Devon Reed',
    description: 'Set Cache-Control headers with s-maxage=60, stale-while-revalidate=600 for high-velocity breaking news feeds.',
    createdAt: '2026-11-15T14:45:00.000Z',
  },
  {
    id: 'opt-104',
    title: 'Defer Third-Party Ad and Tracking Scripts',
    category: 'Third-Party Scripts',
    priority: 'Low',
    status: 'Pending',
    assignedStaff: 'Aisha Patel',
    description: 'Load non-critical analytics and programmatic advertising SDKs asynchronously to minimize Total Blocking Time (TBT).',
    createdAt: '2026-11-18T16:20:00.000Z',
  },
]
