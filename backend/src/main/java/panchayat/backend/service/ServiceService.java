package panchayat.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import panchayat.backend.model.ServiceEntity;
import panchayat.backend.repository.ServiceRepository;

import java.util.List;

@Service
public class ServiceService {

    @Autowired
    private ServiceRepository repo;

    public List<ServiceEntity> getAllServices(){
        return repo.findAll();
    }
}