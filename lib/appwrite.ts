import { CreateUserParams, SignInParams, GetMenuParams, Category } from "@/type";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  platform: "com.musamusakannike.fastfood",
  projectID: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseID: "68bbd4fb00199d4e3509",
  bucketID: "68bd2bfa00000020a723",
  userCollectionID: "user",
  categoriesCollectionID: "categories",
  menuCollectionID: "menu",
  customizationsCollectionID: "customizations",
  menuCustomizationsCollectionID: "menu_customizations",
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectID!)
  .setPlatform(appwriteConfig.platform!);

export const account = new Account(client);

export const databases = new Databases(client);

export const storage = new Storage(client);

const avatars = new Avatars(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw Error;
    await signIn({ email, password });

    const avatarUrl = avatars.getInitialsURL(name);

    return await databases.createDocument(
      appwriteConfig.databaseID!,
      appwriteConfig.userCollectionID!,
      ID.unique(),
      { accountId: newAccount.$id, email, name, avatar: avatarUrl }
    );
  } catch (error) {
    throw new Error(error as string);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseID!,
      appwriteConfig.userCollectionID!,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
};

export const getMenu = async ({category, query, limit}: GetMenuParams) => {
  try {
    const queries: string[] = [];
    if (category) queries.push(Query.equal("categories", category));
    if (query) queries.push(Query.search("name", query));
    if (limit) queries.push(Query.limit(limit));

    const menus = await databases.listDocuments(
      appwriteConfig.databaseID!,
      appwriteConfig.menuCollectionID!,
      queries
    );
    if (!menus) throw Error;

    return menus.documents;
  } catch (error) {
    throw new Error(error as string);
  }
};


export const getCategories = async (
  _params?: Record<string, string | number>
): Promise<Category[]> => {
  try {
    const categories = await databases.listDocuments(
      appwriteConfig.databaseID!,
      appwriteConfig.categoriesCollectionID!
    );
    if (!categories) throw Error;

    return categories.documents as unknown as Category[];
  } catch (error) {
    throw new Error(error as string);
  }
};