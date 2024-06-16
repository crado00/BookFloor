import React, { useState, useEffect }  from "react";
import { View, Image, StyleSheet, FlatList, TouchableOpacity, Text, Modal, Button, ToastAndroid } from "react-native";
import axios from 'axios';
import { TextInput } from "react-native-gesture-handler";
import { searchCode } from "./search/searchCode"

interface books{
    bookId: string,
    bookName: string,
    img: string,
    review: string
}

interface searchBook{
    bookId: string;
    img: string;
    title: string;
    writer: string;
    publisher: string;
}

export default function(){


    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [addModalVisible, setaddModalVisible] = useState<boolean>(false);
    const [review, setReview] = useState('')
    const [search, setSearch] = useState('')
    const [modalBookName, setModalBookName] = useState('도서를 선택해 주세요.')
    const [selectBook, setSelectBook] = useState(null)
    const [searchBoolean, setSearchBoolean] = useState(false);
    const [bookData, setBookData] = useState<searchBook[]>()
    const [pullBookId,setPullBookId] = useState('')
    const [pullBookImg, setPullBookImg] = useState('https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004')

    const [books, setBooks] = useState([])

    const bookAdd = {
        bookId: '0',
        bookName: '도서 추가',
        img: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004',
        review: '도서 추가 버튼임'
    }

    

    const bookIdToFind = '0';

    useEffect(() =>{
        //도서 정보 저장 링크 필요
    })
    const index = books.findIndex(book => book.bookId === bookIdToFind);
    
    if(index === -1){
        books.push(bookAdd)
    }
    

    const btn = (key: books) => {
        if(key.bookId === '0'){
            setaddModalVisible(true);
        }else{
            setSelectBook(key)
            setIsModalVisible(true);
        }
    }

    const onPressModalClose = () => {//도서 추가 취소버튼
        setSearchBoolean(false);
        setaddModalVisible(false);
    }

    const onAddBook = () => {//도서 추가 링크 추가필요
        console.log('id:'+ pullBookId+',name:'+modalBookName+',img:'+pullBookImg+',review:'+review)
        if(pullBookId.length > 0){
            const data= {
                bookId: pullBookId,
                bookName: modalBookName,
                img: pullBookImg,
                review: review,
            }
            const updatedBooks = books.filter(book => book.bookId !== '0');
            updatedBooks.push(data)
            updatedBooks.push(bookAdd)
            setBooks(updatedBooks);
            console.log(data);
            console.log(books);
            setPullBookId('');
            setModalBookName('도서를 선택해 주세요.');
            setPullBookImg('https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004');
            setReview('');
            setSearch('');
            setBookData([]);
            setSearchBoolean(false);
            setaddModalVisible(false);
        }else{
            ToastAndroid.show('도서를 선택해주세요', ToastAndroid.SHORT)
        }
        
        
    }

    const onPressModal2Close = () => {//도서 확인 뒤로가기버튼
        setIsModalVisible(false);
    }
    
    const onRemoveBook = (id) => {//도서 제거 링크 추가필요
        const updatedBooks = books.filter(book => book.bookId !== id);
        setBooks(updatedBooks);
        setIsModalVisible(false);
    }

    const imgBTN = () => {
        setSearchBoolean(true)
    }

    const searchBTN = async () => {
        const booksArray = await searchCode(search);
        setBookData(booksArray)
    }

    const booKselect = (id: string, name: string, img: string) =>{
        setPullBookId(id)
        setModalBookName(name)
        setPullBookImg(img)
        setSearchBoolean(false)
    }

    const cancelBTN = () => {
        setSearchBoolean(false)
    }

    const randerItem = ({item}: {item: books}) => (
        <TouchableOpacity style = { styles.itemContainer } onPress={() => btn(item)}>
            <View style ={ {width: '100%', height: '100%'} }>
                <View style = {{flex: 1}}>
                    <Image style ={ {width: "100%", height: '100%'} } source={{ uri: item.img }}/>
                </View>
                <View style = {{alignItems: 'center', backgroundColor: 'white', height: 20}}>
                    <Text>{item.bookName}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )

    const searchItem = ({item}: {item: searchBook}) => (
        <TouchableOpacity style = {{flex: 1, height: 80, margin: 5, borderColor: '#ccc', borderWidth: 2}} onPress={() => booKselect(item.bookId, item.title, item.img)}>
            <View style ={ {width: '100%', height: '100%', flexDirection: 'row'} }>
                <View style ={ {width: 50, height: '100%'} }>
                    <Image style = {{width: '100%', height: '100%'}} source={{ uri: item.img }}/>
                </View>
                <View style = {{width: '100%', height: '100%'}}>
                <View style = {{marginLeft: 5, flex: 1, height: 40, }}>
                    <Text>{item.title}</Text>
                </View>
                <View style = {{marginLeft: 5, flex: 1, height: 20}}>
                    <Text>{item.writer}</Text>
                </View>
                <View style = {{marginLeft: 5, flex: 1, height: 20}}>
                    <Text>출판사: {item.publisher}</Text>
                </View>
                </View>
                
            </View>
        </TouchableOpacity>
    )

    
    return (
        <View style = {styles.container}>
            <FlatList
                data={books}
                renderItem={randerItem}
                keyExtractor={(item) => item.bookId}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapper}
                style = {{ padding: 20,  backgroundColor: 'gray'}}
            />
            <Modal //도서 추가 모달
                    animationType="slide"
                    visible={addModalVisible}
                    transparent={true}
                >
                    <View style={styles.modaloverlay}>
                        
                   
                        {searchBoolean ? (
                            <View style = {styles.modalContainer}>
                            <Text>도서 선택</Text>
                                <View style = {{flexDirection: 'row', marginLeft: 10, marginRight: 10, width: '100%', marginTop: 10}}>
                                    <TextInput
                                        style={{ flex: 1,
                                            borderColor: '#ccc',
                                            borderWidth: 1,
                                            padding: 8,
                                        }}
                                        value={search}
                                        onChangeText={setSearch}
                                        placeholder="도서 이름을 입력하세요"
                                    />
                                    <Button title="검색" onPress={searchBTN}/>
                                </View>
                                <View style = {{width: '100%',height: 400}}>
                                    <FlatList
                                        data={bookData}
                                        renderItem={searchItem}
                                        keyExtractor={(item) => item.bookId}
                                        style = {{
                                            borderWidth: 2,
                                            borderColor: '#ccc',
                                        }}
                                    />

                                </View>
                                <Button title="취소" onPress={cancelBTN}/>
                            </View>
                        ) : (
                            <View style = {styles.modalContainer}>
                            <Text>도서 추가</Text>
                            <TouchableOpacity onPress={imgBTN}>
                                <View style = {styles.modalImg}>
                                    <Image source={{uri: pullBookImg}} style = {{width: '100%', height: '100%'}}/>
                                </View>
                            </TouchableOpacity>
                            <Text style = {{marginTop: 20, marginBottom: 20}}>{modalBookName}</Text>
                            
                            <View style = {{flexDirection: 'row'}}>
                                <TextInput
                                    style={{ flex: 1,
                                        borderColor: '#ccc',
                                        borderWidth: 1,
                                        padding: 8,
                                        height: 100,
                                    }}
                                    multiline={true}
                                    numberOfLines={4}
                                    value={review}
                                    onChangeText={setReview}
                                    placeholder="한 줄 평을 입력하세요"
                                />
                            </View>
                            <View style = {{flexDirection: 'row', justifyContent: 'space-evenly', width: 200, marginTop: 30}}>
                                    <TouchableOpacity onPress={onPressModalClose}>
                                        <View style = {{backgroundColor: 'blue', padding: 10}}>
                                            <Text>취소</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={onAddBook}>
                                        <View style = {{backgroundColor: 'blue', padding: 10}}>
                                            <Text>완료</Text>
                                        </View>
                                    </TouchableOpacity>
                            </View>
                        </View>
                    
                        )}
                        
                    </View>
                </Modal>
                {selectBook && (
                    <Modal //도서와 한 줄 평 확인가능
                        animationType="slide"
                        visible={isModalVisible}
                        transparent={true}
                    >
                        <View style={styles.modaloverlay}>
                            <View style = {styles.modalContainer}>
                                <Text>{selectBook.bookName}</Text>
                                <TouchableOpacity>
                                    <View style = {styles.modalImg}>
                                        <Image source={{uri: selectBook.img}} style = {{width: '100%', height: '100%'}}/>
                                    </View>
                                </TouchableOpacity>
                                <View style = {{flexDirection: 'row',marginTop: 30}}>
                                    <Text
                                        style={{ flex: 1,
                                            borderColor: '#ccc',
                                            borderWidth: 1,
                                            padding: 8,
                                            height: 100,
                                        }}
                                        numberOfLines={4}
                                    >{selectBook.review}</Text>
                                </View>
                                <View style = {{flexDirection: 'row', justifyContent: 'space-evenly', width: 200, marginTop: 30}}>
                                        <TouchableOpacity onPress={() => onRemoveBook(selectBook.bookId)}>
                                            <View style = {{backgroundColor: 'blue', padding: 10}}>
                                                <Text>제거</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={onPressModal2Close}>
                                            <View style = {{backgroundColor: 'blue', padding: 10}}>
                                                <Text>확인</Text>
                                            </View>
                                        </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        margin: 5, // 각 아이템의 간격을 일정하게 설정
        padding: 10,
    },
    listContent: {
        paddingHorizontal: 10,
    },
    columnWrapper: {
        flexWrap: 'wrap', // 아이템들이 넘치면 줄바꿈이 되도록 설정
        justifyContent: 'flex-start',
    },
    itemContainer: {
        margin: 5, // 각 아이템의 간격을 일정하게 설정
        padding: 10,
        width: 100,
        height: 140
    },
    modaloverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalImg: {
        width: 100,
        height: 140,
        marginTop: 20
    }

})