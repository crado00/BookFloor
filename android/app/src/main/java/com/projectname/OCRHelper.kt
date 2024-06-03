package com.example.myapplication

import android.content.ContentResolver
import android.net.Uri
import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.vision.v1.AnnotateImageRequest
import com.google.cloud.vision.v1.Feature
import com.google.cloud.vision.v1.Image
import com.google.cloud.vision.v1.ImageAnnotatorClient
import com.google.protobuf.ByteString
import java.io.FileInputStream
import java.io.InputStream

object OCRHelper {

    private const val KEY_PATH = "C:\Users\hit06\Downloads\BookFloor-main\ringed-choir-418204-aa6d707717c1.json"

    init {
        System.setProperty("GOOGLE_APPLICATION_CREDENTIALS", KEY_PATH)
    }

    fun extractTextFromImage(imageUri: Uri, contentResolver: ContentResolver): List<String> {
        val imageStream: InputStream? = contentResolver.openInputStream(imageUri)
        val imageBytes: ByteString = ByteString.readFrom(imageStream)
        
        val img = Image.newBuilder().setContent(imageBytes).build()
        val feature = Feature.newBuilder().setType(Feature.Type.TEXT_DETECTION).build()
        val request = AnnotateImageRequest.newBuilder().addFeatures(feature).setImage(img).build()
        
        val requests = listOf(request)
        
        val textList = mutableListOf<String>()
        
        ImageAnnotatorClient.create().use { client ->
            val response = client.batchAnnotateImages(requests)
            val annotation = response.responsesList[0].textAnnotationsList
            for (text in annotation) {
                textList.add(text.description)
            }
        }
        
        return textList
    }

    fun createWordPairs(list: List<String>, delimiter: String): List<Pair<String, String>> {
        val pairsList = mutableListOf<Pair<String, String>>()

        list.forEach { item ->
            val parts = item.split(delimiter)
            if (parts.size > 1) {
                pairsList.add(Pair(parts[0], parts[1]))
            }
        }

        return pairsList
    }
}