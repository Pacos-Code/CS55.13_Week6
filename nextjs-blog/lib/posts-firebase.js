import { db } from './firebase';
import { collection, getDocs, query, where, documentId, connectFirestoreEmulator } from 'firebase/firestore';

export async function getSortedPostsData() {
    const collectionReference = collection(db, 'posts');
    const querySnapshot = await getDocs(collectionReference);
    const jsonObject = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        author: doc.data().author,
        date: doc.data().date,
        contentHtml: doc.data().contentHtml,
    }));

    jsonObject.sort(function(a,b) {
        return a.title.localeCompare(b.title);
    });

    return jsonObject.map(item =>{
        return{
            id: item.id.toString(),
            title: item.title,
            author: item.author,
            date: item.date
        }
    });
}

export async function getAllPostIds() {
    const collectionReference = collection(db, 'posts');
    const querySnapshot = await getDocs(collectionReference);
    const jsonObject = querySnapshot.docs.map(doc => ({
        id: doc.id
    }));

    return jsonObject.map(item => {
        return {
            params: {
                id: item.id.toString()
          }
        }
      });
}

export async function getPostData(id){
    const collectionReference = collection(db, 'posts');
    const searchQuery = query(
        collectionReference,
        where( documentId(), '==', id)
    );
    const querySnapshot = await getDocs(searchQuery);
    const jsonObject = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        author: doc.data().author,
        date: doc.data().date,
        contentHtml: doc.data().contentHtml,
    }));

    if(jsonObject.length === 0) {
        return {
            id: id,
            title:'N/A',
            date: '',
            author: 'N/A',
            contentHtml: 'N/A'
        }
    } else {
        return jsonObject[0];
    }
}