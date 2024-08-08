package ru.kata.spring.boot_security.demo.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class UsersController {

    @GetMapping(value = "/")
    public String doDefaultRedirect() {
        return "redirect:/admin/main";
    }

    @GetMapping(value = "/admin/main")
    public String showMain() {
        return "/admin/main";
    }

    @GetMapping(value = "/user")
    public String showUser() {
        return "/user";
    }

}
