from django.db import models

# 1. Факультет (наприклад: Хімічний, Фізичний)
class Faculty(models.Model):
    name = models.CharField(max_length=100, verbose_name="Назва факультету")

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Факультет"
        verbose_name_plural = "Факультети"

# 2. Предмет (наприклад: Органічна хімія)
class Subject(models.Model):
    name = models.CharField(max_length=100, verbose_name="Назва предмету")
    # Зв'язуємо предмет з факультетом. Якщо видалять факультет - зникнуть і предмети (CASCADE)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, verbose_name="Факультет")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Предмет"
        verbose_name_plural = "Предмети"

# 3. Методичка (Сам файл)
class Material(models.Model):
    title = models.CharField(max_length=200, verbose_name="Назва методички")
    # Файл буде завантажуватись у папку materials/
    file = models.FileField(upload_to='materials/', verbose_name="Файл")
    # Прив'язка до предмету
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, verbose_name="Предмет")
    uploaded_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата завантаження")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Методичка"
        verbose_name_plural = "Методички"