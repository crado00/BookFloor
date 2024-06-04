package com.projectname.ocr

import android.graphics.Bitmap
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ApiService(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "ApiService"

    @ReactMethod
    fun performOCR(imagePath: String, promise: Promise) {
        try {
            val bitmap = BitmapFactory.decodeFile(imagePath)
            val ocrHelper = OCRHelper()
            val result = ocrHelper.recognizeText(bitmap)
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("OCR_ERROR", e)
        }
    }
}