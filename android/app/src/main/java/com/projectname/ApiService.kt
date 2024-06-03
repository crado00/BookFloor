package com.example.myapplication

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST

data class PairData(val pair: Pair<String, String>)

interface ApiService {
    @POST("/upload")
    suspend fun uploadPairs(@Body pairs: List<PairData>)
}

val retrofit = Retrofit.Builder()
    .baseUrl("https://your-server.com/")
    .addConverterFactory(GsonConverterFactory.create())
    .build()

val apiService = retrofit.create(ApiService::class.java)

suspend fun uploadData(pairs: List<Pair<String, String>>) {
    val pairDataList = pairs.map { PairData(it) }
    apiService.uploadPairs(pairDataList)
}