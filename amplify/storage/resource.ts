import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'cloudNotesDrive',
  access: (allow) => ({
    'note-files/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ]
  })
});