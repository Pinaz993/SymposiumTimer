from admin_ordering.admin import OrderableAdmin
from django.contrib import admin
from django.db.models import DurationField
from django.forms import TextInput
from . import models


class TimerInline(OrderableAdmin, admin.StackedInline):
    ordering_field_hide_input = True
    ordering_field = 'order'
    min_num = 1
    model = models.Timer
    fields = ('label', 'duration', 'order')
    formfield_overrides = {
        DurationField: {'widget': TextInput(attrs={'placeholder': 'HH:MM:SS'})}
    }


class ProgramAdmin(admin.ModelAdmin):
    fields = ('name',)
    inlines = (TimerInline,)


admin.site.register(models.Program, ProgramAdmin)
