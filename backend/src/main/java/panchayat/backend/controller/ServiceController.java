package panchayat.backend.controller;




import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
        import panchayat.backend.model.ServiceEntity;
import panchayat.backend.service.ServiceService;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "${app.frontend.url}")
public class ServiceController {

    @Autowired
    private ServiceService service;

    @GetMapping
    public List<ServiceEntity> getAllServices(){
        return service.getAllServices();
    }
}