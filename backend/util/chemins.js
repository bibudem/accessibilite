// Dossier des fichiers des notices, et dossier où vont les fichiers supprimés
exports.DOSSIER_ITEMS = '/apps/accessibilite/prod/backend/files/items';
exports.DOSSIER_SUPPRIMES = '/apps/accessibilite/prod/backend/files-del';

// Un nom de dossier ou de fichier reçu du client doit être un simple nom :
// non vide, sans séparateur ni « . »/« .. », pour ne jamais sortir de DOSSIER_ITEMS.
exports.segmentValide = (nom) =>
  typeof nom === 'string' && nom.length > 0 && nom !== '.' && nom !== '..' && !/[\/\\\0]/.test(nom);
