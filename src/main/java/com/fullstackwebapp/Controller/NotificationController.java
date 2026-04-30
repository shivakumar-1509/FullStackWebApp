package com.fullstackwebapp.Controller;

import com.fullstackwebapp.Model.Notification;
import com.fullstackwebapp.Service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/{sellerId}")
    public List<Notification> getNotifications(@PathVariable Long sellerId) {
        return notificationService.getNotifications(sellerId);
    }

    @GetMapping("/unread/{sellerId}")
    public long getUnreadCount(@PathVariable Long sellerId) {
        return notificationService.getUnreadCount(sellerId);
    }

    @PutMapping("/read/{id}")
    public String markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return "Notification marked as read";
    }

    @PutMapping("/read-all/{sellerId}")
    public String markAllAsRead(@PathVariable Long sellerId) {
        notificationService.markAllAsRead(sellerId);
        return "All notifications marked as read";
    }
}