# Generated by Django 3.2.5 on 2021-07-31 19:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('agenda', '0005_agendamentovacinacao_cidadao'),
    ]

    operations = [
        migrations.RenameField(
            model_name='cidadao',
            old_name='nome',
            new_name='nome_completo',
        ),
        migrations.RemoveField(
            model_name='cidadao',
            name='email',
        ),
    ]