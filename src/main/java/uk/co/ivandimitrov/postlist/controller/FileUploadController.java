// package uk.co.ivandimitrov.postlist.controller;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.stereotype.Controller;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.ResponseBody;
// import org.springframework.web.multipart.MultipartFile;

// import uk.co.ivandimitrov.postlist.storage.StorageService;

// @Controller
// @RequestMapping(value = "/storage")
// public class FileUploadController {

// private StorageService storageService;

// @Autowired
// public FileUploadController(StorageService storageService) {
// this.storageService = storageService;
// }

// @PostMapping(value = "/upload")
// @ResponseBody
// public ResponseEntity<HttpStatus> storeFiles(@RequestParam(value = "files")
// MultipartFile[] files,
// @RequestParam(value = "path") String path) {
// for (MultipartFile file : files) {
// storageService.store(file, path);
// }
// return new ResponseEntity<>(HttpStatus.OK);

// }
// }