from django.db import models
from django.contrib.auth.hashers import make_password, check_password
import uuid

class Item(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Users(models.Model):
    name = models.CharField(max_length=32, unique=True)
    password = models.CharField(max_length=128)
    def set_password(self, raw_password):
        self.password = make_password(raw_password)

