from adminsortable2.admin import SortableInlineAdminMixin
from django.contrib import admin
from django.db.models import DurationField
from django.forms import TextInput
from . import models


class TimerInline(SortableInlineAdminMixin, admin.StackedInline):
    min_num = 1
    extra = 0
    model = models.Timer
    fields = ('label', 'duration')
    formfield_overrides = {
        DurationField: {'widget': TextInput(attrs={'placeholder': 'HH:MM:SS'})}
    }


class ProgramAdmin(admin.ModelAdmin):
    fields = ('name',)
    inlines = (TimerInline,)


admin.site.register(models.Program, ProgramAdmin)
