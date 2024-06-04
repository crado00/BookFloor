package com.projectname.ocr

import android.graphics.Bitmap
import com.googlecode.tesseract.android.TessBaseAPI

class OCRHelper {
    private val tessBaseAPI = TessBaseAPI()

    init {
        tessBaseAPI.init("/path/to/tessdata", "eng") // 언어 설정
    }

    fun recognizeText(bitmap: Bitmap): String {
        tessBaseAPI.setImage(bitmap)
        return tessBaseAPI.utF8Text
    }
}