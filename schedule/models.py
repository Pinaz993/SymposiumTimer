from datetime import timedelta

from django.db import models
from django.utils.timezone import now


class Program(models.Model):
    """
    A model to represent a program of timers that all have a duration and a label. The program will have a name so that
    it can be selected in a drop down menu.
    """

    name = models.CharField(max_length=254)

    def __str__(self):
        return self.name

    def to_dict(self):
        fields = {'start_time', 'name'}
        return {key: self.__dict__[key] for key in self.__dict__.keys() & fields}

    class Meta:
        ordering = ('name',)


class Timer(models.Model):
    """
    A model to represent a single timer to be displayed in a program. Each will have a duration in seconds and a
    label to be displayed on the screen along with the timer itself. Each timer is tied exclusively to
    one program via a foreign key.
    """

    duration = models.DurationField()
    label = models.CharField(max_length=62)
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    order = models.IntegerField("Drag to Reorder", default=0, blank=False, null=False,)

    def __init__(self, *args, actual_duration=0, start_time=0, **kwargs):
        if isinstance(kwargs.get('duration', None), int):
            d = kwargs.pop('duration')
            kwargs['duration'] = timedelta(seconds=d)
            print(type(kwargs))
        super().__init__(*args, **kwargs)
        self.actual_duration = actual_duration
        if start_time == 'now':
            self.start_time = round(now().timestamp())
        elif isinstance(start_time, int):
            self.start_time = start_time

    def __str__(self):
        return str(self.label)

    def to_dict(self):
        fields = {'duration', 'label', 'start_time', 'actual_duration'}
        rtn = {key: self.__dict__[key] for key in self.__dict__.keys() & fields}
        rtn['duration'] = rtn.get('duration').total_seconds()
        return rtn

    class Meta:
        ordering = ('order', 'label')
