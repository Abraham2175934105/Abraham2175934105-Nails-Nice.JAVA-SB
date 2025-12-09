package com.backend.backend.controlador;

import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.*;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "*")
public class UploadController {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @PostMapping
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Archivo vacío");
        }
        try {
            String original = StringUtils.cleanPath(file.getOriginalFilename());
            String ext = "";
            int i = original.lastIndexOf('.');
            if (i >= 0) ext = original.substring(i);
            String filename = System.currentTimeMillis() + ext;
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
            Path target = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            // Construimos URL pública absoluta, p.e. http://localhost:8081/uploads/filename
            String publicUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(filename)
                    .toUriString();

            return ResponseEntity.ok().body(java.util.Map.of("url", publicUrl));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("No se pudo guardar el archivo");
        }
    }
}