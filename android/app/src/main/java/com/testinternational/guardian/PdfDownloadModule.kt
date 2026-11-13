package com.testinternational.guardian

import android.content.ContentValues
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.uimanager.ViewManager
import java.io.File
import java.io.FileInputStream

class PdfDownloadModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  override fun getName() = "PdfDownloadModule"

  @ReactMethod
  fun savePdfToDownloads(sourcePath: String, fileName: String, promise: Promise) {
    var destinationUri: android.net.Uri? = null
    try {
      val source = File(sourcePath)
      if (!source.isFile || source.length() <= 0) {
        throw IllegalArgumentException("The generated PDF is missing or empty.")
      }
      if (fileName.isBlank() || fileName.contains('/') || fileName.contains('\\')) {
        throw IllegalArgumentException("The PDF filename is invalid.")
      }

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        val values = ContentValues().apply {
          put(MediaStore.Downloads.DISPLAY_NAME, "$fileName.pdf")
          put(MediaStore.Downloads.MIME_TYPE, "application/pdf")
          put(
            MediaStore.Downloads.RELATIVE_PATH,
            "${Environment.DIRECTORY_DOWNLOADS}/Parent App",
          )
          put(MediaStore.Downloads.IS_PENDING, 1)
        }
        val resolver = reactApplicationContext.contentResolver
        val outputUri = resolver.insert(
          MediaStore.Downloads.EXTERNAL_CONTENT_URI,
          values,
        ) ?: throw IllegalStateException("Android could not create the Downloads file.")
        destinationUri = outputUri
        val output = resolver.openOutputStream(outputUri)
          ?: throw IllegalStateException("Android could not open the Downloads file.")
        FileInputStream(source).use { input ->
          output.use { input.copyTo(it) }
        }
        val publishedValues = ContentValues().apply {
          put(MediaStore.Downloads.IS_PENDING, 0)
        }
        resolver.update(outputUri, publishedValues, null, null)
        promise.resolve(outputUri.toString())
      } else {
        val directory = Environment.getExternalStoragePublicDirectory(
          Environment.DIRECTORY_DOWNLOADS,
        )
        if (!directory.exists() && !directory.mkdirs()) {
          throw IllegalStateException("Android could not create the Downloads folder.")
        }
        val destination = File(directory, "$fileName.pdf")
        FileInputStream(source).use { input ->
          destination.outputStream().use { input.copyTo(it) }
        }
        promise.resolve(destination.absolutePath)
      }
    } catch (error: Exception) {
      destinationUri?.let {
        reactApplicationContext.contentResolver.delete(it, null, null)
      }
      promise.reject("PDF_DOWNLOAD_FAILED", error.message, error)
    }
  }
}

class PdfDownloadPackage : ReactPackage {
  override fun createNativeModules(
    reactContext: ReactApplicationContext,
  ): List<NativeModule> = listOf(PdfDownloadModule(reactContext))

  override fun createViewManagers(
    reactContext: ReactApplicationContext,
  ): List<ViewManager<*, *>> = emptyList()
}
