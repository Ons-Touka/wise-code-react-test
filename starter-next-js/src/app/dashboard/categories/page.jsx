import { CONFIG } from '../../../config-global';

import { CategoriesView } from '../../../sections/categories/view/categories-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `Catégories | Dashboard - ${CONFIG.appName}`
};

export default function Page() {
  return <CategoriesView />;
}
