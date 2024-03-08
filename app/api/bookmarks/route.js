import connectDB from "@/config/database";
import User from "@/models/User";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

// Route Segment Config
export const dynamic = "force-dynamic";

export const POST = async (request) => {
  try {
    await connectDB();

    const { PropertyId } = await request.json();

    const sessionUser = await getSessionUser();

    if (!session || !session.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser;

    // Find User in database
    const user = await User.findOne({ _id: userId });

    // Check if property is bookmarked
    let isBookmarked = user.bookmarks.includes(PropertyId);

    let message;

    if (isBookmarked) {
      // If already bookmarked, remove it
      user.bookmarks.pull(PropertyId);
      message = "Bookmark removed successfully";
      isBookmarked = false;
    } else {
      // If not bookmarked, add it
      user.bookmarks.push(PropertyId);
      message = "Bookmark added successfully";
      isBookmarked = true;
    }

    await user.save();

    return new Response(JSON.stringify({ message, isBookmarked }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
