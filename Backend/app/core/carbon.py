"""
carbon.py
---------
Module responsable du calcul de l'énergie consommée
et des émissions CO2 pour une session d'apprentissage.

Toutes les valeurs sont des estimations.
"""

from dataclasses import dataclass
from typing import Dict
POWER_CONSUMPTION_KW = 0.05  # 50W laptop
CARBON_INTENSITY = 0.475     # kg CO2 / kWh (moyenne mondiale)

@dataclass
class CarbonConfig:
    """
    Configuration des paramètres carbone.
    Les valeurs sont modifiables selon les besoins.
    """

    # Consommation moyenne des appareils (kW)
    device_power: Dict[str, float] = None

    # Intensité carbone par pays (kg CO2 / kWh)
    carbon_intensity: Dict[str, float] = None

    def __post_init__(self):
        if self.device_power is None:
            self.device_power = {
                "mobile": 0.015,   # 15W
                "laptop": 0.05,    # 50W
                "desktop": 0.15    # 150W
            }

        if self.carbon_intensity is None:
            self.carbon_intensity = {
                "FR": 0.056,
                "US": 0.4,
                "CM": 0.2,
                "DEFAULT": 0.475
            }


class CarbonCalculator:
    """
    Classe responsable du calcul énergie + CO2.
    """

    def __init__(self, config: CarbonConfig = None):
        self.config = config or CarbonConfig()

    def calculate_energy(self, duration_minutes: float, device: str = "laptop") -> float:
        """
        Calcule l'énergie consommée en kWh.
        Formule :
            énergie = puissance(kW) × temps(heures)
        """
        if duration_minutes <= 0:
            return 0.0

        power = self.config.device_power.get(device, 0.05)
        hours = duration_minutes / 60

        energy = power * hours
        return round(energy, 4)

    def calculate_co2(self, energy_kwh: float, country: str = "DEFAULT") -> float:
        """
        Calcule les émissions CO2 en kg.
        Formule :
            CO2 = énergie × facteur carbone
        """
        if energy_kwh <= 0:
            return 0.0

        factor = self.config.carbon_intensity.get(
            country,
            self.config.carbon_intensity["DEFAULT"]
        )

        co2 = energy_kwh * factor
        return round(co2, 4)

    def calculate_session_footprint(
        self,
        duration_minutes: float,
        device: str = "laptop",
        country: str = "DEFAULT"
        ) -> dict:
        """
        Méthode complète : calcule énergie + CO2 en une seule fois.
        """
        energy = self.calculate_energy(duration_minutes, device)
        co2 = self.calculate_co2(energy, country)

        return {
            "duration_minutes": round(duration_minutes, 2),
            "energy_kwh": energy,
            "co2_kg": co2
        }

