import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useContext } from 'react';
import ProjectContext from '../context/ProjectContext';

function Breadcrumbs() {
  const location = useLocation();
  const params = useParams();
  const { currentProject } = useContext(ProjectContext);

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/dashboard', icon: Home }];

    if (paths[0] === 'projects') {
      breadcrumbs.push({ label: 'Projects', path: '/projects' });
      
      if (params.id && currentProject) {
        breadcrumbs.push({
          label: currentProject.title,
          path: `/projects/${params.id}`,
        });
      }
    } else if (paths[0] === 'all-issues') {
      breadcrumbs.push({ label: 'All Issues', path: '/all-issues' });
    } else if (paths[0] === 'team') {
      breadcrumbs.push({ label: 'Team', path: '/team' });
    } else if (paths[0] === 'settings') {
      breadcrumbs.push({ label: 'Settings', path: '/settings' });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const Icon = crumb.icon;

        return (
          <div key={crumb.path} className="flex items-center gap-2">
            {Icon ? (
              <Link
                to={crumb.path}
                className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <Icon className="w-4 h-4" />
                <span>{crumb.label}</span>
              </Link>
            ) : isLast ? (
              <span className="font-medium text-slate-800">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.path}
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
            {!isLast && <ChevronRight className="w-4 h-4 text-slate-400" />}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;