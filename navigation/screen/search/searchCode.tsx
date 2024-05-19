import React, { useEffect, useState } from "react";
import axios from "axios";



async function searchCode(keyword: string){
    const authKey = '3893e049e54f909aaaf758d6feda80d62f0619816c3d4ab05a76826ae6dbb046'
    const url = `http://data4library.kr/api/srchBooks?authKey=${authKey}&title=${keyword}&pageNo=1&pageSize=10&format=json`;
    console.log('===확인===\n');
    console.log(url)
    
    try {
        const response = await axios.get(url);
        const obj = response.data;
        console.log(obj);
        const booksArray: { bookId: string; img: string; title: string; writer: string; publisher: string; }[] = [];
        if (obj.response && obj.response.docs) {
            obj.response.docs.forEach((item) => {
                const book = item.doc;
                console.log(`전달값: ${book.isbn13}`)
                booksArray.push({
                    bookId: book.isbn13,
                    img: book.bookImageURL,
                    title: book.bookname,
                    writer: book.authors,
                    publisher: book.publisher
                });
            });
        }
        return booksArray;
    } catch (error) {
        console.error(`Error: ${error}`);
        return [];
    }
}

export { searchCode };