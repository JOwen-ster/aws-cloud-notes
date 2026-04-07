import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'cloudNotesDrive',
  access: (allow) => ({
    'note-files/{entity_id}/*': [
      // only the person who uploaded/created can manage their notes
      // read counts as get and list
      // https://docs.amplify.aws/nextjs/build-a-backend/storage/authorization/
      allow.entity('identity').to(['read', 'write', 'delete'])
    ]
  })
});