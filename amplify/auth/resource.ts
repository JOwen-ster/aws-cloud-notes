import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});


// WHEN FETCHING A USER
/*

import { getCurrentUser } from 'aws-amplify/auth';
  const { username, userId, signInDetails } = await getCurrentUser();
  console.log(`The username: ${username}`);
  // this is known as a sub in cognito which is a per user id created by amplify-auth / cognito
  // amplify storage natively supports entity id for authorizaed access to storage so thats why we use entity id and not sub in the url
  console.log(`The userId: ${userId}`);
  console.log(`The signInDetails: ${signInDetails}`);
}

*/