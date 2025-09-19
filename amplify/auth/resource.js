import { defineAuth } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: {
      userInvitation: {
        emailSubject: "Lives at Sea invitation",
        emailBody: (user, code) =>
          `You can now log in to Lives at Sea with username ${user()} and temporary password ${code()}.\nPlease change your password to something that you do not use anywhere else.`,
      },
    },
  },
});
