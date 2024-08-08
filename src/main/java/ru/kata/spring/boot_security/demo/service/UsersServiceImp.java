package ru.kata.spring.boot_security.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UsersRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UsersServiceImp implements  UserService {

    private final UsersRepository usersRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    @Override
    public List<User> findAll() {
        return usersRepository.findAll();
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<User> findOne(int id) {
        return usersRepository.findById(id);
    }

    @Transactional(readOnly = true)
    @Override
    public List<Role> findAllRoles(){
        return roleRepository.findAll();
    }

    @Override
    public void save(User user) {
        if (user.getRole() == null) {
            if (roleRepository.findByType("ROLE_USER").isPresent()) {
                user.setRole(List.of(roleRepository.findByType("ROLE_USER").get()));
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                usersRepository.save(user);
            } else {
                Role role_default = new Role();
                role_default.setType("ROLE_USER");
                save(role_default);
            }
        } else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            usersRepository.save(user);
        }

    }

    @Override
    public void save(User user, int[] rolesIds) {

        List<Role> roles = new ArrayList<>();
        for (int rolesId : rolesIds) {
            roles.add(roleRepository.getById(rolesId));
        }

        user.setRole(roles);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        usersRepository.save(user);

    }

    @Override
    public void save(Role role) {
        if (roleRepository.findByType(role.getType()).isEmpty()) {
            roleRepository.save(role);
        }
    }

    @Override
    public void update(User tmp, int[]  rolesIds) {

        List<Role> roles = new ArrayList<>();
        for (int rolesId : rolesIds) {
            roles.add(roleRepository.getById(rolesId));
        }

        tmp.setRole(roles);
        tmp.setPassword(passwordEncoder.encode(tmp.getPassword()));
        usersRepository.save(tmp);

    }

    @Override
    public void update(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        usersRepository.save(user);
    }

    @Override
    public void deleteUserById(int id) {
        usersRepository.deleteById(id);
    }


}
