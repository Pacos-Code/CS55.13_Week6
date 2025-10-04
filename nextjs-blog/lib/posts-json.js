import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'data');
// Return posts from `data/posts.json`, sorted by title and normalized for display
export function getSortedPostsData() {
    // Build absolute path to the JSON data file under the local `data` directory
    const filePath = path.join(dataDirectory, 'posts.json');
    // Read the entire JSON file contents into memory as a UTF-8 string
    const jsonString = fs.readFileSync(filePath, 'utf-8');
    // Parse the JSON string into a JavaScript array of post objects
    const jsonObject = JSON.parse(jsonString);

    // Sort posts by title using locale-aware string comparison
    jsonObject.sort(function(a, b){
        return a.title.localeCompare(b.title);
    }); 
    // Normalize and shape the objects returned to the rest of the app
    return jsonObject.map(item =>{
        return{
            id: item.id.toString(),
            title: item.title,
            author: item.author,
            date: item.date
        }
    });

}
// Returns an array of objects with params containing post IDs, used for dynamic routing in Next.js
export function getAllPostIds() {
    // Build absolute path to the JSON data file under the local `data` directory
    const filePath = path.join(dataDirectory, 'posts.json');
    // Build absolute path to the JSON data file under the local `data` directory
    const jsonString = fs.readFileSync(filePath, 'utf-8');
    // Summarize jsonObject
    // jsonObject is expected to be an array of post objects loaded from posts.json.
    // Each object typically has: id, title, author, date, and possibly other fields.
    // Example:
    // [
    //   { id: 1, title: "First Post", author: "Alice", date: "2024-01-01" },
    //   { id: 2, title: "Second Post", author: "Bob", date: "2024-02-01" }
    // ]
    const jsonObject = JSON.parse(jsonString);
    // The next lines return an array of objects, each with a `params` property containing an `id` string.
    // This is used by Next.js dynamic routing to generate paths for each post.
    // For example, if posts.json contains [{id: 1}, {id: 2}], the result will be:
    // [ { params: { id: "1" } }, { params: { id: "2" } } ]
    return jsonObject.map(item => {
        return {
            params: {
                id: item.id.toString()
          }
        }
      });
}
// The getPostData function retrieves a single post object from the posts.json file by matching the given id.
// If a post with the specified id is found, it returns the post object; otherwise, it returns a default "Not Found" object.
export async function getPostData (id) {
    // Read posts.json synchronously and return the post matching `id`; function does not need to be async
    // Note: `pages/posts/[id].js` awaits this call, but since this is synchronous, `await` is unnecessary (harmless) and can be removed
    const filePath = path.join(dataDirectory, 'posts.json');
    const jsonString = fs.readFileSync(filePath, 'utf-8');
    const jsonObject = JSON.parse(jsonString);

    const objReturned = jsonObject.filter(obj => {
        return obj.id.toString() === id;
    });
        if (objReturned.length === 0) {
            return {
                id: id,
                title: 'Not Found',
                author: 'Not Found',
                date: '',
                contentHtml: 'Not Found'
            }
        } else{
            return objReturned[0];
        }
}