import { Account, Services, Device, Types } from "@tago-io/sdk";
import { TagoContext } from "../types";

/** Account Summary
 * @param  {Object} context analysis context
 * @param  {TagoAccount} account account object from TagoIO
 * @param  {Object} user user object with their data
 * Example: { name: 'John Doe', phone: '+1444562367', email: 'johndoe@tago.io', timezone: 'America/Chicago' }
 * @param  {Array} tags tags to be added/update in to the user
 * Example: [{ key: 'country', value: 'United States' }]
 * @return {Promise}
 */

interface UserData {
  email: string;
  name: string;
  phone?: string | number | boolean | void;
  timezone: string;
  tags?: Types.Common.TagsObj[];
  password?: string;
  language?: "en" | "pt" | "es" | string;
}

async function inviteUser(context: TagoContext, account: Account, user_data: UserData) {
  user_data.email = user_data.email.toLowerCase();

  // Generate a Random Password
  const password = user_data.password || String(new Date().getTime());

  // Try to create the user.
  const result: void | { user: string } = await account.run
    .userCreate({
      active: true,
      company: "",
      email: user_data.email,
      language: user_data.language || "en",
      name: user_data.name,
      phone: String(user_data.phone) || "",
      tags: user_data.tags,
      timezone: user_data.timezone || "America/New_York",
      password,
    })
    .catch(() => null);

  if (!result) {
    // If got an error, try to find the user_data.
    // const [user_data] = await account.run.listUsers(1, ["id", "email", "tags"], { email: user_data.email }, 1);
    const [user] = await account.run.listUsers({ page: 1, amount: 1, filter: { email: user_data.email }, fields: ["id", "name", "email", "tags"] });
    if (!user) throw "Couldn`t find user data";

    // If found, update the tags.
    user.tags = user.tags.filter((x) => user_data.tags.find((y) => x.key !== y.key));
    user.tags = user.tags.concat(user_data.tags);

    await account.run.userEdit(user.id, { tags: user_data.tags });
    return user.id;
  }

  // If success, send an email with the password.
  // Create email template "invite_user" in the user run account
  const emailService = new Services({ token: context.token }).email;
  emailService.send({
    to: user_data.email,
    template: {
      name: "invite_user",
      params: {
        name: user_data.name,
        email: user_data.email,
        password: password,
      },
    },
  });

  // > Old way to send email if needed.

  // emailService.send({
  //   to: user_data.email,
  //   subject: "Account Details",
  //   message: `Your account for the application was created..\n\nYour Login is: <b>${user_data.email}</b>\nYour password is: <b>${password}</b>\n\n In order to access it, visit our website <a href="${domain_url}">${domain_url}</a>`,
  // });

  return result.user;
}

export default inviteUser;
