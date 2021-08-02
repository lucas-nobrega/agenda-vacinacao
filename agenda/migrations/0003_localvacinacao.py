# Generated by Django 3.2.5 on 2021-07-28 02:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('agenda', '0002_popula_base'),
    ]

    operations = [
        migrations.CreateModel(
            name='LocalVacinacao',
            fields=[
                ('vlr_latitude', models.FloatField()),
                ('vlr_longitude', models.FloatField()),
                ('cod_munic', models.CharField(max_length=255)),
                ('cod_cnes', models.CharField(max_length=255, primary_key=True, serialize=False)),
                ('nom_estab', models.CharField(max_length=255)),
                ('dsc_endereco', models.CharField(max_length=255)),
                ('dsc_bairro', models.CharField(max_length=255)),
                ('dsc_cidade', models.CharField(max_length=255)),
            ],
        ),
    ]
