import Realm from 'realm';

import TanqueSchema from '../schemas/TanqueRepository';
import ColetaSchema from '../schemas/ColetaRepository';

export default function getRealm() {
  return Realm.open({
    schema: [TanqueSchema, ColetaSchema],
    deleteRealmIfMigrationNeeded: true
  });
}