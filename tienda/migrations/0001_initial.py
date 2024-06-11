# Generated by Django 4.1.2 on 2024-05-28 18:46

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('cod_Producto', models.AutoField(db_column='codigoProducto', primary_key=True, serialize=False)),
                ('nombreProducto', models.CharField(max_length=100)),
                ('precio', models.IntegerField()),
                ('precioDolar', models.IntegerField()),
                ('imagen', models.ImageField(null=True, upload_to='productos')),
            ],
        ),
    ]
