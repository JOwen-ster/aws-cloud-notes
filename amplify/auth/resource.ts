import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  /*Email is REQUIRED. Cognito sends verification code, 
  User must confirm before fully using account. This prevents fake emails */
  userAttributes: {
    email: {
      required: true,
    }
  },
  /* Password Rules */
    passwordPolicy: {
    minLength: 8,
    requireNumbers: true,
    requireLowercase: true,
    requireUppercase: true,
    requireSymbols: false,
  },
});
