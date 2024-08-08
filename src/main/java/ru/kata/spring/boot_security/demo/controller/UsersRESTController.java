package ru.kata.spring.boot_security.demo.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.management.relation.RoleNotFoundException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api")
public class UsersRESTController {

    private final UserService userService;

    @GetMapping("/AuthenticatedUser")
    public ResponseEntity<User> getAuthenticatedUser(@AuthenticationPrincipal User user) {
        return new ResponseEntity<>(user, HttpStatus.ACCEPTED);
    }

    @GetMapping("/Users")
    public ResponseEntity<List<User>> getUsers() {
        return new ResponseEntity<>(userService.findAll(), HttpStatus.ACCEPTED);
    }

    @GetMapping("/Users/{id}")
    public ResponseEntity<Optional<User>> getUser(@PathVariable("id") int id) {
        System.out.println(userService.findOne(id));
        return new ResponseEntity<>(userService.findOne(id), HttpStatus.ACCEPTED);
    }

    @GetMapping("/Roles")
    public ResponseEntity<List<Role>> getRoles() {
        return new ResponseEntity<>(userService.findAllRoles(), HttpStatus.ACCEPTED);
    }

    @PatchMapping("/Users")
    public ResponseEntity<User> updateUser(@RequestBody User updatedUser) {
        userService.update(updatedUser);
        return new ResponseEntity<>(updatedUser, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/Users/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable("id") int id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PostMapping("/Users")
    public ResponseEntity<HttpStatus> create(@RequestBody User user) throws RoleNotFoundException {
        userService.save(user);
        return ResponseEntity.ok(HttpStatus.CREATED);
    }


}
