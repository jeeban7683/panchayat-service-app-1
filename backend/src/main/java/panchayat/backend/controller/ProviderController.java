package panchayat.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import panchayat.backend.model.ServiceProvider;
import panchayat.backend.service.ProviderService;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "http://localhost:5173")
public class ProviderController {

    @Autowired
    private ProviderService service;

    @PostMapping("/register")
    public ServiceProvider register(@RequestBody ServiceProvider provider){
        return service.register(provider);
    }

    @GetMapping("/verified")
    public List<ServiceProvider> getAll(){
        return service.getVerified();
    }
}
