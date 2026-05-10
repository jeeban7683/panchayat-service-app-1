//package panchayat.backend.service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import panchayat.backend.model.ServiceProvider;
//import panchayat.backend.repository.ProviderRepository;
//
//import java.awt.*;
//import java.util.List;
//
//@Service
//public class ProviderService {
//
//    @Autowired
//    private ProviderRepository repo;
//
//    public ServiceProvider register(ServiceProvider provider){
//        provider.setVerified(false);
//        return repo.save(provider);
//    }
//
//    public ServiceProvider verifyProvider(Long id){
//        ServiceProvider provider = repo.findById(id).orElseThrow(() -> new RuntimeException("Provider not found"));
//        provider.setVerified(true);
//        repo.findByIsVerified(true);
//        return repo.save(provider);
//    }
//
//    public List<ServiceProvider> getVerified() {
//        return repo.findByIsVerified(true);
//    }
//}
package panchayat.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import panchayat.backend.model.ServiceProvider;
import panchayat.backend.repository.ProviderRepository;

import java.util.List;

@Service
public class ProviderService {

    @Autowired
    private ProviderRepository repo;

    public ServiceProvider register(ServiceProvider provider) {
        provider.setIsVerified(true);   // Automatically verify new providers
        return repo.save(provider);
    }

    public List<ServiceProvider> getVerified() {
        return repo.findByIsVerified(true);
    }

    public List<ServiceProvider> getAll() {
        return repo.findAll();
    }

    public ServiceProvider getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
    }
}